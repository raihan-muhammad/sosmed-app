import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import bgProfile from "../../assets/bg-profile.jpg";
import profile from "../../assets/avatar.jpg";
import { UserContext } from "../../App";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [nameTagline, setNameTagline] = useState(null);
  const [myPosts, setPosts] = useState([]);
  const [loading, setLoading] = useState("");
  const [loadingBtn, setLoadingBtn] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userId) : true
  );
  useEffect(() => {
    const myProfile = async () => {
      const reqProfile = await fetch(`/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const result = await reqProfile.json();

      setPosts(result.posts);
      setUserProfile(result);
      setNameTagline(result);
      setLoading("aaa");
    };
    myProfile();
  }, []);

  const followUser = async () => {
    const reqFollow = await fetch(`/api/v1/users/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ followId: userId }),
    });

    const resFollow = await reqFollow.json();
    dispatch({
      type: "UPDATE",
      payload: {
        followers: resFollow.followers,
        following: resFollow.following,
      },
    });
    localStorage.setItem("user", JSON.stringify(resFollow));
    setUserProfile((prevState) => {
      return {
        ...prevState,
        user: {
          ...prevState,
          followers: [...prevState.user.followers, resFollow._id],
        },
      };
    });

    setLoadingBtn("");
    setShowFollow(false);
  };

  const unfollowUser = async () => {
    const reqUnfollow = await fetch(`/api/v1/users/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ unfollowId: userId }),
    });

    const resUnfollow = await reqUnfollow.json();
    dispatch({
      type: "UPDATE",
      payload: {
        followers: resUnfollow.followers,
        following: resUnfollow.following,
      },
    });
    localStorage.setItem("user", JSON.stringify(resUnfollow));
    window.location.reload();
    setUserProfile((prevState) => {
      const newFollower = prevState.user.followers.filter(
        (item) => item != resUnfollow._id
      );

      return {
        ...prevState,
        user: {
          ...prevState,
          followers: newFollower,
        },
      };
    });

    setLoadingBtn("");
    setShowFollow(true);
  };

  return (
    <>
      {userProfile ? (
        <section className="container">
          <div className="card card-profile">
            <div className="card-image waves-effect waves-block waves-light card-header">
              <img
                className="activator-header"
                src={bgProfile}
                alt="user background"
              />
            </div>
            <figure className="card-profile-image">
              <img
                src={
                  userProfile
                    ? userProfile.user.photo
                      ? userProfile.user.photo
                      : userProfile.user.user.photo
                    : "https://res.cloudinary.com/sosmedapp/image/upload/v1591985290/default_eaqogg.jpg"
                }
                alt="profile image"
                className="circle z-depth-2 responsive-img activator-profile"
              />
            </figure>
            <div className="card-content">
              <div className="row">
                <div className="container">
                  <div className="col s12 m12 center-align">
                    <h4 className="card-title grey-text text-darken-4">
                      {nameTagline ? nameTagline.user.name : "loading..."}
                    </h4>
                    <p className="medium-small grey-text">
                      {nameTagline ? nameTagline.user.tagline : "loading..."}
                    </p>
                    {showFollow ? (
                      <button
                        className="btn waves-effect waves-light blue darken-2"
                        id="btn-follow"
                        onClick={() => {
                          setLoadingBtn("ok");
                          followUser();
                        }}
                      >
                        <i className="material-icons left">arrow_upward</i>
                        {loadingBtn === "" ? "Follow" : "loading..."}
                      </button>
                    ) : (
                      <button
                        className="btn waves-effect waves-light blue darken-2"
                        id="btn-follow"
                        onClick={() => {
                          setLoadingBtn("ok");
                          unfollowUser();
                        }}
                      >
                        <i className="material-icons left">arrow_upward</i>
                        {loadingBtn === "" ? "Unfollow" : "loading..."}
                      </button>
                    )}
                  </div>
                  <div className="col s12 m4 center-align">
                    <h4 className="card-title grey-text text-darken-4">
                      {myPosts ? myPosts.length : "loading..."}
                    </h4>
                    <p className="large grey-text">Posts</p>
                  </div>
                  <div className="col s12 m4 center-align">
                    <h4 className="card-title grey-text text-darken-4">
                      {userProfile
                        ? userProfile.user.followers.length
                        : "loading..."}
                    </h4>
                    <p className="large grey-text">Followers</p>
                  </div>
                  <div className="col s12 m4 center-align">
                    <h4 className="card-title grey-text text-darken-4">
                      {userProfile.user.following
                        ? userProfile.user.following.length
                        : userProfile.user.user.following.length}
                    </h4>
                    <p className="large grey-text">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="posts">
            <div className="row">
              {myPosts.map((post) => {
                return (
                  <div className="col s12 m4 post-me" key={post._id}>
                    <img
                      className="responsive-img"
                      id="my-post"
                      src={post.photo}
                    />
                  </div>
                );
              })}
              {loading === "" ? (
                <div className="preloader-wrapper big active" id="preloader">
                  <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                      <div className="circle"></div>
                    </div>
                    <div className="gap-patch">
                      <div className="circle"></div>
                    </div>
                    <div className="circle-clipper right">
                      <div className="circle"></div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </section>
      ) : (
        <div
          className="preloader-wrapper big active"
          id="preloader"
          style={{ marginTop: "43vh" }}
        >
          <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
