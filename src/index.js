require("dotenv").config();
const admin = require('firebase-admin');
const functions = require ('firebase-functions');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./users/typeDefs');
const { getContext } = require("./auth");
admin.initializeApp();
admin.firestore().settings({ignoreUndefinedProperties:true});
const resolvers = require('./users/resolvers')(admin);
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

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
  credentials: true,
};
const app = express();
app.use(cors(corsOptions))
app.use(
  session({
    secret: "20b11n17-MKRK-4str",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: getContext,
  playground: true,
  introspection: true,
  cors: corsOptions,
});

server.applyMiddleware({
  app,
  path: "/api/",
  cors: corsOptions
});

exports.graphql = functions.https.onRequest(app);
