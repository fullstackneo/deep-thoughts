import React, { useState } from 'react';
import { ADD_THOUGHT } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  //  the addThought() function will run the actual mutation. The error variable will initially be undefined but can change depending on if the mutation failed.
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    // In the update() function, addThought represents the new thought that was just created.

    // The useMutation Hook can include an update function that allows us to update the cache of any related queries. The query we'll need to update is QUERY_THOUGHTS; import this query into ThoughtForm/index.js with the following line:

    update(cache, { data: { addThought } }) {
      // could potentially not exist yet, so wrap in a try/catch
      // 如果直接访问 / profile 那么还没有QUERY_THOUGHTS 还没有缓存，会报错
      // read what's currently in the cache
      try {
        const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
        console.log('thoughts:', thoughts);

        // prepend the newest thought to the front of the array
        cache.writeQuery({
          query: QUERY_THOUGHTS,
          data: { thoughts: [addThought, ...thoughts] },
        });
      } catch (e) {
        console.log('err: ', e);
      }

      // Thankfully, you usually only have to manually update the cache when adding or deleting items from an array. You won't need to perform any cache updates for the next feature, the Add Reaction form.
      // 这个无需要绑定try catch，因为home页面调用QUERY_BASIC_ME 时候，缓存了QUERY_BASIC_ME 但并没有缓存Query_ME
      // update me array's cache
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        console.log(me);

        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      } catch (e) {
        console.log('lai le!!!: ', e);
      }
    },
  });

  const handleChange = event => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    // setText('');
    // setCharacterCount(0);
    try {
      // add thought to database
      await addThought({
        variables: { thoughtText },
      });

      // clear form value
      setText('');
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      {/* <p className="m-0">Character Count: {characterCount}/280</p> */}
      <p
        className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}
      >
        Character Count: {characterCount}/280
        {/* The error variable will initially be undefined but can change depending on if the mutation failed. */}
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>

        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
