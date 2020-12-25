const { DateTimeResolver, DateResolver } = require("graphql-scalars");
const users = require("../users/resolvers");

const resolvers = () => {
    const resolvers ={};
    const scalars = {
      DateTime: DateTimeResolver,
      Date: DateResolver,
    };
    const queries = {};
    const mutations = {};
    Object.assign(queries, users().Query);
    Object.assign(mutations, users().Mutation);
    //add more queries/mutations here (lists, comments, etc)

    Object.assign(resolvers, scalars);
    resolvers.Query = queries;
    resolvers.Mutation = mutations;

    return resolvers;
}

module.exports = resolvers;