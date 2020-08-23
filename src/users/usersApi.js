const { ApolloError, ValidationError } = require("apollo-server-express");
const uuid = require("uuid");
const moment = require("moment");
const errorsDictionary = require("./errorsDictionary");

module.exports.addUser = async (admin, data) => {
    console.log('add user', data)
    const { username, fullName, email, country } = data;
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
    const id = uuid.v4();
    const creationDate = moment().toISOString();

    await admin.firestore().collection("users").doc(id).set({ id, username, fullName, email, country, creationDate });
    const userDoc = await admin.firestore().doc(`users/${id}`).get();
    const user = userDoc.data();
    return user || new ValidationError(errorsDictionary.SERVER_ERROR);
  } catch (error) {
    throw new ApolloError(error);
  }
};
