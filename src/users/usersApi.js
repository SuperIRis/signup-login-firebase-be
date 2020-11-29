const { ApolloError, ValidationError } = require("apollo-server-express");
//const uuid = require("uuid");
const moment = require("moment");
const errorsDictionary = require("./errorsDictionary");

function getUidFromToken (admin, idToken){
  return admin.auth().verifyIdToken(idToken);
}

module.exports.addUser = async (admin, data) => {

  const { id, email, fullName, username, country, socialId, providerId, birthDate } = data;
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
    await admin
      .firestore()
      .collection("users")
      .doc(id)
      .set({
        email,
        fullName,
        username,
        country,
        socialId,
        providerId,
        birthDate: birthDate,
        creationDate,
      });
    const userDoc = await admin.firestore().doc(`users/${id}`).get();
    const user = userDoc.data();
    return user || new ValidationError(errorsDictionary.SERVER_ERROR);
  } catch (error) {
    console.log('throw new apollo', error)
    throw new ApolloError(error);
  }
};

module.exports.deleteUser = async (admin, data) =>{
  const {id} = data;
  try {
    const userDoc = await admin.firestore().doc(`users/${id}`).delete();
    return userDoc ? {id, ...userDoc} : new ValidationError(errorsDictionary.SERVER_ERROR);
  }
  catch{
    throw new ApolloError(error);
  }
}

