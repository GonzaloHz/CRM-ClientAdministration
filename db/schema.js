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

    type Client {
        id: ID
        name: String
        lastName: String
        company: String
        email: String
        phone: String
        seller: ID
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

    input ClientInput {
        name: String!
        lastName: String!
        company: String!
        email: String!
        phone: String
    }

    type Query {
        # Users
        getUser(token: String!): User
    
        # Product
        getProducts: [Product]    
        getProductById(id: ID!): Product

        # Clients
        getAllTheClients: [Client]
        getClientWithSeller(id: ID!): [Client]
        getClientWithId(id: ID!): Client
    }

    type Mutation {
        # Users
        newUser(input: UserInput): User
        authenticateUser(input: AuthenticateUserInput): Token
        
        # Product
        newProduct(input: ProductInput): Product
        actualiceProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String

        # Clients
        newClient(input: ClientInput): Client
        renewClient(input: ClientInput, id: ID!): Client
    }
`

module.exports = typeDefs;