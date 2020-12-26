const { ApolloError, ValidationError } = require("apollo-server-express");
const { errorsDictionary } = require("@mokuroku/mokuroku-commons/dictionaries/errors");
const admin = require("firebase-admin");
const { clearCookie, requireUser } = require("../auth");
const {validateEmail, validateName, validateUsername} = require("../utils/validations")
const moment = require("moment");

const addUser = async (_, args, context) => {
  const { email, fullName, username, country, socialId, birthDate } = args;
  const { uid } = context;
  const providerId = context.firebase.sign_in_provider;
  if(!validateEmail(email) || !validateName(fullName) || !validateUsername(username)){
    throw new ValidationError(errorsDictionary.PAYLOAD_WRONG_FORMAT);
  }

  try {
    //Check that email is not registered yet
    const existantEmailDoc = await admin.firestore().collection("users").where("email", "==", email).get();
    if (!existantEmailDoc.empty) {
      throw new ValidationError(errorsDictionary.EMAIL_ALREADY_IN_USE);
    }
    //Check that username is not registered yet
    const existantUsernameDoc = await admin.firestore().collection("users").where("username", "==", username).get();
    if (!existantUsernameDoc.empty) {
      throw new ValidationError(errorsDictionary.USERNAME_ALREADY_IN_USE);
    }
    //if it doesn´t exist, create users
    const creationDate = moment().toISOString();
    await admin.firestore().collection("users").doc(uid).set({
      email,
      fullName,
      username,
      country,
      socialId,
      providerId,
      birthDate: birthDate,
      creationDate,
    });
    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    const user = userDoc.data();
    return user || new ValidationError(errorsDictionary.SERVER_ERROR);
  } catch (error) {
    throw new ApolloError(error);
  }
};

const deleteUser = async (_, args, context) => {
  const { id } = args;
  try {
    const userDoc = await admin.firestore().doc(`users/${id}`).delete();
    return userDoc ? { id, ...userDoc } : new ValidationError(errorsDictionary.SERVER_ERROR);
  } catch {
    throw new ApolloError(error);
  }
};

const logoutUser = async (_, args, context) => {
    return requireUser(_, args, context, clearCookie);
};

module.exports.addUser = addUser;
module.exports.deleteUser = deleteUser;
module.exports.logoutUser = logoutUser;