const { User } = require('../models');

// notify error with user authentication without crashing server
const { AuthenticationError } = require('apollo-server-express');

// give user a valid JWT on sign up or login
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {

    },

    Mutation: {

    }
};

module.exports = resolvers;