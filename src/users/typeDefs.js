const types = `
  type User {
      id:ID!
      username: String!
      fullName: String!
      email: String!
      country: String!
      socialId: String
      providerId: String
      birthDate: Date
      creationDate: DateTime
    }
`;

const queries = `
    users: [User!]!
    user(id:ID): User
    currentUser(idToken:String!): User
`;

const mutations = `
    addUser(fullName: String!, username: String!, email: String!, country: String!, socialId:String, birthDate:Date): User
    logoutUser: Payload
    deleteUser(id: ID!): User
`;

module.exports.types = types;
module.exports.queries = queries;
module.exports.mutations = mutations;
