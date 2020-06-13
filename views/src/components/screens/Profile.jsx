import React, { useEffect, useState, useContext } from "react";
import bgProfile from "../../assets/bg-profile.jpg";
import profile from "../../assets/avatar.jpg";
import { UserContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
  const [myPosts, setPosts] = useState([]);
  const [loading, setLoading] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [showBtn, setShowBtn] = useState("");
  useEffect(() => {
    const myProfile = async () => {
      const reqProfile = await fetch(`/api/v1/posts/my-post`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const result = await reqProfile.json();
      setPosts(result.posts);
      setLoading("aaa");
    };
    myProfile();
  }, []);

  const updateProfile = async () => {
    try {
      if (image) {
        M.toast({
          html: "processing... please wait",
          classes: "blue darken-3",
        });
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "sosmedapp");
        data.append("cloud_name", "sosmedapp");
        const requestImage = await fetch(
          `https://api.cloudinary.com/v1_1/sosmedapp/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const resultImage = await requestImage.json();
        setUrl(resultImage.secure_url);

        const reqUpdateProfile = await fetch(`/api/v1/users/updateMe`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            name: name ? name : state.name,
            photo: resultImage.secure_url
              ? resultImage.secure_url
              : state.photo,
            tagline: tagline ? tagline : state.tagline,
          }),
        });
        const resUpdateProfile = reqUpdateProfile.json();
        console.log(resUpdateProfile);
        window.location.reload();
        const up = localStorage.setItem(
          "user",
          JSON.stringify({
            ...state,
            name: name ? name : state.name,
            photo: resultImage.secure_url,
            tagline: tagline ? tagline : state.tagline,
          })
        );
        dispatch({ type: "UPDATE_PROFILE", payload: up });
        window.location.reload();
      }
      M.toast({
        html: "processing... please wait",
        classes: "blue darken-3",
      });

      const reqUpdateProfile = await fetch(`/api/v1/users/updateMe`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          name: name ? name : state.name,
          photo: state.photo,
          tagline: tagline ? tagline : state.tagline,
        }),
      });
      const resUpdateProfile = reqUpdateProfile.json();
      console.log(resUpdateProfile);
      const up = localStorage.setItem(
        "user",
        JSON.stringify({
          ...state,
          name: name ? name : state.name,
          photo: state.photo,
          tagline: tagline ? tagline : state.tagline,
        })
      );
      window.location.reload();
      dispatch({ type: "UPDATE_PROFILE", payload: up });
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
            src={state ? state.photo : "loading..."}
            alt="profile image"
            className="circle z-depth-2 responsive-img activator-profile"
          />
        </figure>
        <div className="card-content">
          <div className="row">
            <div className="container">
              <div className="col s12 m12 center-align">
                <h4 className="card-title grey-text text-darken-4">
                  {state ? state.name : "Loading..."}
                </h4>
                <p className="medium-small grey-text">
                  {state ? state.tagline : "Loading..."}
                </p>
                {showBtn !== "" ? (
                  <>
                    <div className="input-field col s12">
                      <label htmlFor="name" className="active">
                        Full name
                      </label>
                      <input
                        type="text"
                        className="validate"
                        name="name"
                        id="name"
                        placeholder={state.name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="file-field input-field col s12">
                      <div className="btn btn-small blue-grey darken-2">
                        <span>
                          <i className="material-icons left">file_upload</i>{" "}
                          Image
                        </span>
                        <input
                          type="file"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                      </div>
                      <div className="file-path-wrapper">
                        <input
                          className="file-path validate"
                          type="text"
                          placeholder="Upload your image (optional)"
                        />
                      </div>
                    </div>
                    <div className="input-field col s12">
                      <label htmlFor="name" className="active">
                        Tagline
                      </label>
                      <input
                        type="text"
                        className="validate"
                        name="name"
                        id="name"
                        placeholder={state.tagline}
                        onChange={(e) => setTagline(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn blue darken-2 waves-effect waves-light"
                      onClick={() => updateProfile()}
                    >
                      Update Profile
                    </button>
                  </>
                ) : (
                  <button
                    className="btn blue darken-2 waves-effect waves-light"
                    onClick={() => setShowBtn("ok")}
                    style={{ marginTop: "1em" }}
                  >
                    <i className="material-icons left">settings</i>
                    Update Profile
                  </button>
                )}
              </div>
              <div className="col s12 m4 center-align">
                <h4 className="card-title grey-text text-darken-4">
                  {myPosts.length}
                </h4>
                <p className="large grey-text">Posts</p>
              </div>
              <div className="col s12 m4 center-align">
                <h4 className="card-title grey-text text-darken-4">
                  {state ? state.followers.length : "loading..."}
                </h4>
                <p className="large grey-text">Followers</p>
              </div>
              <div className="col s12 m4 center-align">
                <h4 className="card-title grey-text text-darken-4">
                  {state ? state.following.length : "loading..."}
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
                <img className="responsive-img" id="my-post" src={post.photo} />
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
  );
};

export default Profile;
