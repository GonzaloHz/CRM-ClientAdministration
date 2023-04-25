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
    
    type Product {
        id: ID
        name: String
        quantity: Int
        price: Float
        created: String
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

    input ProductInput {
        name: String!
        quantity: Int!
        price: Float!
    }

    type Query {
        # Users
        getUser(token: String!): User
    
        # Product
        getProducts: [Product]    
        getProductById(id: ID!): Product
    }

    type Mutation {
        # Users
        newUser(input: UserInput): User
        authenticateUser(input: AuthenticateUserInput): Token
        
        # Product
        newProduct(input: ProductInput): Product
        actualiceProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String
    }
`

module.exports = typeDefs;