// Integrated the Apollo Server GraphQL library to handle data requests to our API
// We've set up our means of retrieving data using GraphQL queries
const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type Book{
        _id: ID
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type User{
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
        bookCount: Int
    }

    type Query{
        me: User
        users: [User]
    }

    type Mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String]!, description: String!, title: String!, bookId: String!, image: String!, link: String): User
        removeBook(bookId: String!): User
    }

    type Auth{
        token: ID!
        user: User
    }
`;

module.exports = typeDefs;