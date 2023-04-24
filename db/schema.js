const { gql } = require('apollo-server')

const typeDefs = gql`
    type User {
        id: ID
        name: String
        lastName: String
        email: String
        created: String
    }

    type Token {
        token: String
    }

    input AuthenticateUserInput {
        email: String!
        password: String!
    }

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    type Query {
        getUser(token: String!): User
    }

    type Mutation {
        newUser(input: UserInput): User
        authenticateUser(input: AuthenticateUserInput): Token
    }
`

module.exports = typeDefs;