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

// establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
const httpLink = createHttpLink({
  //  The React environment runs at localhost:3000, and the server environment runs at localhost:3001
  // if we just used /graphql, as we've done previously, the requests would go to localhost:3000/graphql
  uri: '/graphql',
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
const client = new ApolloClient({
  link: httpLink,
  // InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
  cache: new InMemoryCache(),
});

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
              <Route path="/profile/:username?" element={<Profile />} />
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
