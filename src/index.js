const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');
const functions = require ('firebase-functions');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./users/typeDefs');
admin.initializeApp(functions.config().firebase);
const resolvers = require('./users/resolvers')(admin);
const {addUser} = require('./users/usersApi');

const app = express();
const server = new ApolloServer({typeDefs, resolvers, playground:true, introspection:true});

server.applyMiddleware({app, path:'/', cors:true})
exports.graphql = functions.https.onRequest(app);

functions.auth.user().onCreate(user=>{
    console.log(user)
    addUser(admin, {email: user.data.email, username:user.data.username})
});