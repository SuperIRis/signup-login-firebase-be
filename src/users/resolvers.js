const { ApolloError, ValidationError } = require('apollo-server-express');
const { DateTimeResolver, DateResolver } = require('graphql-scalars');
const uuid = require('uuid');
const moment = require ('moment');
const errorsDictionary = require('./errorsDictionary');
const { addUser, deleteUser } = require("./usersApi");


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
        addUser: async (_, data) => {
          return addUser(admin, data);
        },
        deleteUser: async (_, data) => {
          return deleteUser(admin, data);
        },
      },
    };
}
