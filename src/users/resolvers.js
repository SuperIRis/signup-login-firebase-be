const { ApolloError, ValidationError } = require('apollo-server-express');
const { DateTimeResolver, DateResolver } = require('graphql-scalars');
const { requireUser } = require('../auth');
const uuid = require('uuid');
const moment = require ('moment');
const errorsDictionary = require('./errorsDictionary');
const { addUser, deleteUser } = require("./usersApi");
const { validateToken, verifyCookie } = require("../auth");

module.exports = (admin)=>{
    return {
      DateTime: DateTimeResolver,
      Date: DateResolver,
      Query: {
        users: async () => {
          const users = await admin.firestore().collection("users").get();
          const usersData = users.docs.map((user) => {
            return {id: user.id, ...user.data()}
          });
          return usersData
        },
        user: async (_, { id }) => {
          try {
            const userDoc = await admin.firestore().doc(`users/${id}`).get();
            const user = userDoc.data();
            return user || new ValidationError(errorsDictionary.USER_UNKNOWN);
          } catch (error) {
            console.log('nope! we are not doing this', id)
            throw new ApolloError(error);
          }
        },
        currentUser: async (_, {idToken}, context)=>{
          try {
            console.log('hello!, looking for', idToken)
            console.log('context', context)
            const userAuth = await verifyCookie(idToken);
            console.log(userAuth);
            //return user || new ValidationError(errorsDictionary.FAILED_AUTH);
            const userDoc = await admin.firestore().doc(`users/${userAuth.user_id}`).get();
            const user = userDoc.data();
            console.log(user);
            return user || new ValidationError(errorsDictionary.USER_UNKNOWN);
          } catch (error) {
            console.log("nope! we are not doing this");
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
        addUser: async (_, args, context) => {
          //return requireUser(args, context, addUser);
          return addUser(args, context);
        },
        deleteUser: async (_, args, context) => {
          return requireUser(args, context, deleteUser);
          return deleteUser(args);
        },
      },
    };
}
