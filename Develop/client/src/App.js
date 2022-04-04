import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Apollo client, connect with graphQL and apollo server.
// Create an Apollo Provider to make every request work with the Apollo server.
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// The last thing we need to do is instruct the Apollo instance in App.js to 
// retrieve the token stored in local storage every time we make a GraphQL 
// request.
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    // set the header object to have all the other headers, and then add
    // an authorization header
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
    
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            {/* catch all route page. */}
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
