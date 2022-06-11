import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';
import Auth from '../utils/auth';

const SingleThought = props => {
  const { id: thoughtId } = useParams();
  console.log(thoughtId);
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId },
  });
  const thought = data?.thought || {};
  const reactions = thought.reactions;
  console.log(reactions);
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
          {/* {loading ? <div>Loading...</div> : <p>{reactions}</p>} */}
        </div>
      </div>
      {thought.reactionCount && <ReactionList reactions={thought.reactions} />}
      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
    </div>
  );
};

export default SingleThought;
