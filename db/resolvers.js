const User = require('../models/User')

const resolvers = {
    Query: {
        getCourses: () => "hi"
    },
    Mutation: {
        newUser: async (_, {input}, ctx) => {
            const { email } = input;

            //Check if the user was already register
            const registeredUser = await User.findOne({email})
            if(registeredUser) throw new Error('The user has already exists')

            //Save it on db
            try {
                const newUser = new User(input);
                newUser.save();
                return newUser;
            } catch (error) {
                console.log(error);
            }

        }
    }
}

module.exports = resolvers;