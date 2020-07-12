const {GraphQLServer} = require('graphql-yoga');

const typeDefs = `
    type Query {
        info:String!
    }
    `;

const resolvers = {
    Query:{
        info: ()=>'This is info'
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>console.log('Server is running in http://localhost:4000'));

