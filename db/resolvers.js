const User = require('../models/User')
const Product = require('../models/Product')
const bcryptjs = require('bcryptjs')
var jwt = require('jsonwebtoken');

const createToken = (userInfo, secretWord, expiresIn) => {
    const { id, name, lastName, email } = userInfo;
    return jwt.sign({ id, name, lastName, email }, secretWord, { expiresIn });
} 

const resolvers = {
    Query: {
        getUser: async (_, {token}) => {
            const userId = await jwt.verify(token, process.env.SECRET_WORD)
            return userId
        }
    },
    Mutation: {
        newUser: async (_, {input}) => {
            const { email, password } = input;

            //Check if the user was already register
            const registeredUser = await User.findOne({email})
            if(registeredUser) throw new Error('The user has already exists')

            //Hash the password
            let salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt)

            //Save it on db
            try {
                const newUser = new User(input);
                newUser.save();
                return newUser;
            } catch (error) {
                console.log(error);
            }

        },
        authenticateUser: async (_, {input}) => {
            const { email, password } = input;

            //Check the user
            const userExists = await User.findOne({email})
            if(!userExists) throw new Error(`The user isn't exists`)
            
            //Check the pw
            const pwExists = bcryptjs.compare(password, userExists.password); 

            if(!pwExists) throw new Error('The password is incorrect')
            return {
                token: createToken(userExists, process.env.SECRET_WORD, '24h')
            }
        },
        newProduct: async (_, {input}) => {
            const { name, quantity, price } = input;
            try {
                if(!name || !quantity || !price) throw new Error(`There aren't all the requirements`)
                const newProduct = new Product(input);
                const result = newProduct.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = resolvers;