// Apollo hook
import { useQuery } from '@apollo/client';
import React from 'react';
import ThoughtList from '../components/ThoughtList';
import { QUERY_THOUGHTS } from '../utils/queries';

const Home = () => {
  // use useQuery hook to make query request
  // asynchronous

  // Once the query is complete and loading is undefined
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // What we're saying is, if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component.

  // This is called optional chaining, and it's new to JavaScript—so new that only browsers seem to support it. If we tried to use it in a Node server, we'd receive a syntax error, because Node doesn't know what it is yet.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
