const { gql } = require("apollo-server-express");
const { DateTimeTypeDefinition, DateTypeDefinition } = require("graphql-scalars");
const {types:userTypes, queries:userQueries, mutations:userMutations} = require ("../users/typeDefs");
//Add new scalars here
const scalars = [DateTimeTypeDefinition, DateTypeDefinition];
//Add more default types here
const defaultTypes = `
type Payload {
    status: String
    message: String
}
`;
//add more when we have more (lists, comments)
const types = [defaultTypes, userTypes]; 
const queries = [userQueries];
const mutations = [userMutations]; 

const gqlTypes = `${types.join(' ')} type Query {${queries.join(' ')}} type Mutation{${mutations.join(' ')}}`;

const typeDefs = [...scalars, gql(gqlTypes)]

module.exports = typeDefs;


/* 
The above code will export an array like this one:
module.exports = [
  DateTimeTypeDefinition,
  DateTypeDefinition,
  gql`
    type Payload {
        status: String
        message: String
    }

    type User {
      id: ID!
      username: String
      fullName: String
      email: String!
      country: String
      socialId: String
      providerId: String
      birthDate: Date
      creationDate: DateTime
    }

    type Query {
      users: [User!]!
      user(id: ID): User
      currentUser(idToken: String!): User
      getUserByEmail(email: String!): User
      getUserByUsername(username: String!): User
    }

    type Mutation {
      addUser(
        fullName: String!
        username: String!
        email: String!
        country: String!
        socialId: String
        birthDate: Date
      ): User
      logoutUser: Payload
      deleteUser(id: ID!): User
    }
  `,
];
 */