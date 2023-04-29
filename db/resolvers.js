const User = require('../models/User')
const Product = require('../models/Product')
const Client = require('../models/Client')
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
            return userId;
        },
        getProducts: async () => {
            try {
                const allTheProds = await Product.find({})
                return allTheProds; 
            } catch (error) {
                console.log(error);
            }
        },
        getProductById: async (_, {id}) => {
            try {
                const theProdWithId = await Product.findById(id)
                if(!theProdWithId) throw new Error('There is not product with that id')
                return theProdWithId;
            } catch (error) {
                console.log(error)
            }
        },
        getAllTheClients: async () => {
            try {
                const clients = await Client.find({})
                return clients;
            } catch (error) {
                console.log(error);
            }
        },
        getClientWithSeller: async (_, {}, ctx) => {
            try {
                const clientsList = await Client.find({seller: ctx.user.id})
                if(!clientsList) throw new Error('There are not clients wiht that seller id')
                return clientsList;
            } catch (error) {
                console.log(error);
            }
        },
        getClientWithId: async (_, {id}, ctx) => {
            try {
                const result = await Client.findById(id)

                if(!result) throw new Error('There is not client with that id')
                if(result.seller.toString() !== ctx.user.id) throw new Error('Your credentials are not valid for this action')

                return result;
            } catch (error) {
                console.log(error);
            }
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
            };
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
        },
        actualiceProduct: async (_, {id, input}) => {
            try {
                let theProdToRenew = await Product.findById(id);
                if(!theProdToRenew) throw new Error('There is not product with that id')
                theProdToRenew = await Product.findOneAndUpdate({_id: id}, input, {new: true})
                return theProdToRenew;
            } catch (error) {
                console.log(error);
            }
        },
        deleteProduct: async (_, {id}) => {
            try {
                const productToDlt = await Product.findById(id);
                if(!productToDlt) throw new Error('there is not product with that id')
                await Product.findByIdAndDelete({_id: id})
                return "The product has been removed";
            } catch (error) {
                console.log(error);
            }
        },
        newClient: async (_, {input}, ctx) => {
            const { email } = input;
            const registeredClient = await Client.findOne({email})
            if(registeredClient) throw new Error('There is an user with that email')

            var newClient = new Client(input)
            newClient.seller = ctx.user.id;
            try {
                const result = await newClient.save()
                return result;
            } catch (error) {
                console.log(error);
            }            
        },
        renewClient: async (_, {input, id}, ctx) => {
            try {
                let oldClient = await Client.findById(id)
                if(!oldClient) throw new Error('There is not client with that id')
                if(oldClient.seller.toString() !== ctx.user.id) throw new Error('Your credentials are not valid for this action')
                let result = await Client.findByIdAndUpdate({_id: id}, input, {new: true})
                return result;
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = resolvers;