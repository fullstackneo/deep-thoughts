import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';
import { ADD_Friend } from '../utils/mutations';
import ThoughtForm from '../components/ThoughtForm';

const Profile = props => {
  const { username: userParam } = useParams();

  // const { loading, data } = useQuery(QUERY_USER, {
  //   variables: { username: userParam },
  // });

  //customize profile page for logged-in user
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const [addFriend, { error }] = useMutation(ADD_Friend);
  const [beFriend, setbeFriend] = useState('false');
  const handleClick = async () => {
    setbeFriend(!beFriend);
    // if (!beFriend) {
    //   try {
    //     await addFriend({
    //       variables: { id: user._id },
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }

    // if (!beFriend) {
    //   await addFriend({
    //     variables: { id: user._id },
    //   });
    // } else {
    //   await cancelFriend({
    //     variables: { id: user._id },
    //   });
    // }

    !beFriend
      ? await addFriend({
          variables: { id: user._id },
        })
      : await addFriend({
          variables: { id: user._id },
        });
  };

  const user = data?.me || data?.user || {};
  console.log(loading);

  // 如果user最终为 { },/profile页面报错

  // 如果网页后面链接名字是自己，使用Navigate跳转
  // navigate to personal profile page if username is the logged-in user's
  // loggedIn 方法既确保有token又确保token在有效期内
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(user.friends);

  if (!user.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            {beFriend ? 'Cancel Friend' : 'Add Friend'}
          </button>
        )}
      </div>
      {/* {user && ( */}
      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      {/* )} */}
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
