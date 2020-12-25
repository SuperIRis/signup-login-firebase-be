const { ApolloError, ValidationError } = require("apollo-server-express");
const admin = require("firebase-admin");
const { verifyCookie } = require("../auth");

const users = async() =>{
  const users = await admin.firestore().collection("users").get();
  const usersData = users.docs.map((user) => {
    return { id: user.id, ...user.data() };
  });
  return usersData;
}

const user = async (_, { id }) => {
  try {
    const userDoc = await admin.firestore().doc(`users/${id}`).get();
    const user = userDoc.data();
    return user || new ValidationError(errorsDictionary.USER_UNKNOWN);
  } catch (error) {
    console.log('nope! we are not doing this', id)
    throw new ApolloError(error);
  }
}

const currentUser = async (_, {idToken}, context)=>{
  try {
    const userAuth = await verifyCookie(idToken);
    //return user || new ValidationError(errorsDictionary.FAILED_AUTH);
    const userDoc = await admin.firestore().doc(`users/${userAuth.user_id}`).get();
    const user = userDoc.data();
    return user || new ValidationError(errorsDictionary.USER_UNKNOWN);
  } catch (error) {
    console.log("nope! we are not doing this");
    throw new ApolloError(error);
  }
}

module.exports.users = users;
module.exports.user = user;
module.exports.currentUser = currentUser;