const { gql } = require("apollo-server-express");
const { DateTimeTypeDefinition, DateTypeDefinition } = require("graphql-scalars");

module.exports = [
  DateTimeTypeDefinition,
  DateTypeDefinition,
  gql`
    type User {
      id:ID!
      username: String
      fullName: String
      email: String!
      country: String
      socialId: String
      providerId: String
      birthDate: Date
      creationDate: DateTime
    }
    
    type Avatar {
      userid: String
      thumbnailUrl:String
    }

    type Query {
      users: [User!]!
      user(id:ID!): User
      getUserByEmail(email: String!): User
      getUserByUsername(username: String!): User
    }
    
    type Mutation {
      addUser(id:ID!, fullName: String!, username: String!, email: String!, country: String!, socialId:String, providerId:String, birthDate:Date): User
      deleteUser(id: ID!): User
    }
  `,
];