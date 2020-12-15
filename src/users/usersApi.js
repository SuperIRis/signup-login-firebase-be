const { ApolloError, ValidationError } = require("apollo-server-express");
//const uuid = require("uuid");
const admin = require("firebase-admin");
const moment = require("moment");
const errorsDictionary = require("./errorsDictionary");

function getUidFromToken (admin, idToken){
  return admin.auth().verifyIdToken(idToken);
}

module.exports.addUser = async (data, context) => {
  const { email, fullName, username, country, socialId, birthDate } = data;
  const { uid } = context;
  const providerId = context.firebase.sign_in_provider;
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
      .doc(uid)
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
    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    const user = userDoc.data();
    return user || new ValidationError(errorsDictionary.SERVER_ERROR);
  } catch (error) {
    console.log('throw new apollo', error)
    throw new ApolloError(error);
  }
};

module.exports.deleteUser = async (data) =>{
  const {id} = data;
  try {
    const userDoc = await admin.firestore().doc(`users/${id}`).delete();
    return userDoc ? {id, ...userDoc} : new ValidationError(errorsDictionary.SERVER_ERROR);
  }
  catch{
    throw new ApolloError(error);
  }
}
// const functions = require("firebase-functions");
// module.exports.getCurrentUser = async (admin, data)=>{
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       // User is signed in.
//     } else {
//       // No user is signed in.
//     }
//   });
// }

