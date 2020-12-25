const {users, user, currentUser } = require("./queries");
const {addUser, logoutUser, deleteUser} = require("./mutations");

const resolvers = () =>{
  return {
    Query: { users, user, currentUser },
    Mutation: { addUser, logoutUser, deleteUser}
  };
}

module.exports = resolvers;
