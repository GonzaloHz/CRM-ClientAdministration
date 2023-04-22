const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const connectDB = require('./config/db')

//Connect to DB
connectDB();

//Server
const server = new ApolloServer({
    typeDefs,
    resolvers
});

//Start server
server.listen().then(({url}) =>
    console.log(`Server ready on the url ${url}`)
)