const { gql } = require("apollo-server-express");
const { DateTimeTypeDefinition } = require("graphql-scalars");

module.exports = [
  DateTimeTypeDefinition,
  gql`
    type RemoveResponse {
      id: String
      username: String
      email: String
    }

    type User {
      id:String
      username: String
      fullName: String
      email: String!
      country: String
      creationDate: DateTime
    }
    type Query {
      users: [User]
      user(id:String!): User
      getUserByEmail(email: String!): User
      getUserByUsername(username: String!): User
    }
    type Mutation {
      addUser(id:String!, fullName: String!, username: String!, email: String!, country: String!): User
      deleteUser(id: String, username: String, email: String): RemoveResponse
    }
  `,
];