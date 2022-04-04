import { gql } from '@apollo/client';

// making the query to the database and telling it what to return.
export const GET_ME = gql`
    {
        me{
            _id
            username
            email
            savedBooks{
                _id
                title
                authors
                description
                bookId
                image
                link
            }
            bookCount
        }
    }
`;