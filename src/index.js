//require("dotenv").config();
const admin = require('firebase-admin');
const functions = require ('firebase-functions');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./users/typeDefs');
admin.initializeApp();
admin.firestore().settings({ignoreUndefinedProperties:true});
const resolvers = require('./users/resolvers')(admin);

const corsOptions = {
  origin: [
    "http://localhost:3000/",
    "https://localhost:3000/",
    "http://mokuroku-staging-aad4c.web.app/",
    "https://mokuroku-staging-aad4c.web.app/",
    "http://mokuroku.me/",
    "https://mokuroku.me/",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://mokuroku-staging-aad4c.web.app",
    "https://mokuroku-staging-aad4c.web.app",
    "http://mokuroku.me",
    "https://mokuroku.me",
  ],
};
const app = express();
const server = new ApolloServer({ typeDefs, resolvers, playground: true, introspection: true, cors: corsOptions });

server.applyMiddleware({
  app,
  path: "/api/",
  cors: corsOptions,
});

exports.graphql = functions.https.onRequest(app);
