const { ApolloError, ValidationError } = require('apollo-server-express');
const { DateTimeResolver } = require('graphql-scalars');
const uuid = require('uuid');
const moment = require ('moment');
const errorsDictionary = require('./errorsDictionary');
const { addUser } = require("./usersApi");


module.exports = (admin)=>{
    return {
      DateTime: DateTimeResolver,
      Query: {
        users: async () => {
          const users = await admin.firestore().collection("users").get();
          return users.docs.map((user) => user.data());
        },
        user: async (_, { id }) => {
          try {
            const userDoc = await admin.firestore.doc(`users/${id}`).get();
            const user = userDoc.data();
            return user || new ValidationError(errorsDictionary.USER_UNKNOWN);
          } catch (error) {
            throw new ApolloError(error);
          }
        },
        getUserByEmail: async (_, { email }) => {
          try {
            const userDoc = await admin.firestore().collection("users").where("email", "==", email).get();
            const users = userDoc.docs.map((user) => user.data());
            return users[0] || new ValidationError(errorsDictionary.USER_UNKNOWN);
          } catch (error) {
            throw new ApolloError(error);
          }
        },
        getUserByUsername: async (_, { username }) => {
          try {
            const userDoc = await admin.firestore().collection("users").where("username", "==", username).get();
            const users = userDoc.docs.map((user) => user.data());
            return users[0] || new ValidationError(errorsDictionary.USER_UNKNOWN);
          } catch (error) {
            throw new ApolloError(error);
          }
        },
      },
      Mutation: {
        addUser: async (_, { username, fullName, email, country }) => {
          return addUser(admin, { username, fullName, email, country });
        },
        deleteUser: async (_, { id, username, email}) => {
          try {
            if(id){
            const deleteSuccess = await db.collection("users").doc(id).delete();
            }
            else if(username){
            const existantUsernameDoc = await admin
                .firestore()
                .collection("users")
                .where("username", "==", username)
                .get();
            if (existantUsernameDoc.empty) {
                throw new ValidationError(errorsDictionary.USER_UNKNOWN);
            }
            else{
                existantUsernameDoc.forEach(function (doc) {
                    doc.ref.delete();
                });
            }
            }
            else if (email) {
            const existantUsernameDoc = await admin
                .firestore()
                .collection("users")
                .where("email", "==", email)
                .get();
            if (existantUsernameDoc.empty) {
                throw new ValidationError(errorsDictionary.USER_UNKNOWN);
            } else {
                existantUsernameDoc.forEach(function (doc) {
                doc.ref.delete();
                });
            }
            }
            else{
                throw new ValidationError(errorsDictionary.MISSING_DATA);
            }
            return {id, username, email};
          } catch (error) {
            throw new ApolloError(error);
          }
        },
      },
    };
}
