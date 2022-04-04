const { User } = require('../models');

// notify error with user authentication without crashing server
const { AuthenticationError } = require('apollo-server-express');

// give user a valid JWT on sign up or login
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find()
            .populate('savedBooks');
        },

        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                  .populate('savedBooks');
            
                return userData;
              }
            
              throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);

            // give the user a JWT. (JWT was set to have an expiration of 2 hours)
            const token = signToken(user);

            // return an object that combines the token with the user's data.
            // This matches our Auth type we defined.
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // uses bcrypt to compare the incoming password with the hashed password
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // give the user that is logging in a token
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: {...args} } },
                    // return back updated user object and run the 
                    // validators to make sure that the book being saved is a
                    // valid book
                    { new: true, runValidators: true }
                );

                if (!updatedUser) {
                    throw new AuthenticationError('Could not update this user\'s books');
                }

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        // remove book from user's saved list.
        removeBook: async (parent, { bookId }, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                if (!updatedUser) {
                    throw new AuthenticationError('Could not update this user\'s books');
                }

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;