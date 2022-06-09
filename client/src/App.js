import React from 'react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

import { setContext } from '@apollo/client/link/context';

// establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
const httpLink = createHttpLink({
  //  The React environment runs at localhost:3000, and the server environment runs at localhost:3001
  // if we just used /graphql, as we've done previously, the requests would go to localhost:3000/graphql
  uri: '/graphql',
});

// With this function, setContext, we can create essentially a middleware function that will retrieve the token for us and combine it with the existing httpLink.

// Because we're not using the first parameter, but we still need to access the second one, we can use an underscore _ to serve as a placeholder for the first parameter.

//  In this case, we don't need the first parameter offered by setContext(), which stores the current request object in case this function is running after we've initiated a request.
const authLink = setContext((_, { headers }) => {

  // we use the setContext() function to retrieve the token from localStorage
  const token = localStorage.getItem('id_token');
  return {
    // set the HTTP request headers of every request to include the token, whether the request needs it or no
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//  to combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API
// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  // InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
  cache: new InMemoryCache(),
});


// Any time we make a request to the server, we use the code we just implemented a few moments ago to automatically set the HTTP request headers with our token. This way, our server can receive the request, check the token's validity, and allow us to continue our request if it is.


// Lastly, we need to enable our entire application to interact with our Apollo Client instance.
function App() {
  return (
    // ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="containter">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/profile/" element={<Profile />} />
              <Route path="/thought/:id" element={<SingleThought />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
