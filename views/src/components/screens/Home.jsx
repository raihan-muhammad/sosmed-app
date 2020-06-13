import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import bgProfile from "../../assets/bg-profile.jpg";
import profile from "../../assets/avatar.jpg";
import { UserContext } from "../../App";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState("");
  const [loadComment, setLoadComment] = useState("");
  const [cekLike, setCekLike] = useState("");
  const [cekUnlike, setCekUnlike] = useState("");
  const { state } = useContext(UserContext);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/v1/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const resJson = await res.json();
      setData(resJson.posts);
      setLoading("a");
    };
    fetchData();
  }, []);

  const like = async (id) => {
    try {
      setCekUnlike("ok");
      setCekLike("");
      const res = await fetch(`/api/v1/posts/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
      const resJson = await res.json();
      const newData = data.map((item) => {
        if (item._id == resJson._id) {
          return resJson;
        } else {
          return item;
        }
      });
      setData(newData);
      setCekUnlike("");
    } catch (err) {
      console.log(err);
    }
  };

  const unlike = async (id) => {
    try {
      setCekLike("ok");
      setCekUnlike("");
      const res = await fetch(`/api/v1/posts/unlike`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
      const resJson = await res.json();
      const newData = data.map((item) => {
        if (item._id === resJson._id) {
          return resJson;
        } else {
          return item;
        }
      });
      setData(newData);
      setCekLike("");
    } catch (err) {
      console.log(err);
    }
  };

  const comment = async (text, postId) => {
    try {
      const reqComment = await fetch(`/api/v1/posts/comment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      });
      const resComment = await reqComment.json();
      const newData = data.map((item) => {
        if (item._id === resComment._id) {
          return resComment;
        } else {
          return item;
        }
      });
      setData(newData);
      setLoadComment("");
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const reqDelete = await fetch(`/api/v1/posts/delete-post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const resDelete = await reqDelete.json();
      console.log(resDelete);
      const newData = data.filter((item) => {
        return item._id !== resDelete._id;
      });
      setData(newData);
      M.toast({
        html: "post successfully deleted",
        classes: "red darken-3",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="row content-home">
        <div className="col s12 m8">
          {loading === "" ? (
            <div className="preloader-wrapper big active" id="preloader-home">
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
          {data.map((item) => {
            return (
              <div className="card" key={item._id}>
                <div className="card-image" id="card-image-home">
                  <img src={item.photo} alt="Post" />
                  {item.postedBy._id === state._id ? (
                    <a
                      className="btn-floating halfway-fab waves-effect waves-light red darken-3"
                      onClick={() => {
                        M.toast({
                          html: "Waiting...",
                          classes: "blue darken-3",
                        });
                        deletePost(item._id);
                      }}
                    >
                      <i className="material-icons">delete</i>
                    </a>
                  ) : null}
                </div>
                <div className="card-content">
                  <div className="like-section">
                    {item.likes.includes(state._id) ? (
                      cekLike === "" ? (
                        <i
                          className="material-icons pink-text darken-3"
                          id="icon-like"
                          onClick={() => unlike(item._id)}
                        >
                          favorite
                        </i>
                      ) : (
                        <div
                          className="preloader-wrapper big active"
                          id="preloader-like"
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
                      )
                    ) : cekUnlike === "" ? (
                      <i
                        className="material-icons"
                        id="icon-unlike"
                        onClick={() => like(item._id)}
                      >
                        favorite_border
                      </i>
                    ) : (
                      <div
                        className="preloader-wrapper big active"
                        id="preloader-like"
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
                    <p className="text-like">{item.likes.length} likes</p>
                  </div>
                  <p>
                    <Link
                      to={
                        item.postedBy._id !== state._id
                          ? `profile/${item.postedBy._id}`
                          : `profile`
                      }
                    >
                      <span className="text-me black-text">
                        {item.postedBy.name}{" "}
                      </span>
                    </Link>
                    {item.body}
                  </p>
                  <hr />
                  {item.comments.map((comment) => {
                    return (
                      <p key={comment._id}>
                        <Link
                          to={
                            comment.postedBy._id !== state._id
                              ? `profile/${comment.postedBy._id}`
                              : `profile`
                          }
                        >
                          <span className="text-me black-text">
                            {comment.postedBy.name}{" "}
                          </span>
                        </Link>
                        {comment.text}
                      </p>
                    );
                  })}

                  {loadComment !== "" ? "loading..." : ""}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      comment(e.target[0].value, item);
                      e.target[0].value = "";
                      setLoadComment("ok");
                    }}
                  >
                    <div className="input-field">
                      <label htmlFor="comment">Comment</label>
                      <input
                        type="text"
                        className="validate"
                        name="comment"
                        id="comment"
                      />
                    </div>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col s12 m4">
          <div className="card card-profile-home">
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
                    <h4 className="card-title-home grey-text text-darken-4">
                      {state ? state.name.split(" ")[0] : "loading..."}
                    </h4>
                    <p className="medium-small grey-text tag-jobs">
                      {state ? state.tagline : "loading..."}
                    </p>
                    <Link to="/profile" className="white-text">
                      <button className="btn waves-effect waves-light blue darken-2">
                        <i className="material-icons left">perm_identity</i>
                        Profile
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
