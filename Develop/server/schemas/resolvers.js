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
        
    }
};

module.exports = resolvers;