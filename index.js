const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const connectDB = require('./config/db')
const jwt = require('jsonwebtoken')

//Connect to DB
connectDB();

//Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || ''
        if(token){
            try {
                const user = jwt.verify(token, process.env.SECRET_WORD)
                return {
                    user
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
});

//Start server
server.listen().then(({url}) =>
    console.log(`Server ready on the url ${url}`)
)