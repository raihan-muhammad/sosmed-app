import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Post = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const addPost = async () => {
      try {
        if (url) {
          const requestData = await fetch(
            `http://localhost:5500/api/v1/posts`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
              body: JSON.stringify({
                body,
                image: url,
              }),
            }
          );
          const resultData = await requestData.json();
          if (resultData.error) {
            M.toast({
              html: resultData.error,
              classes: "#c62828 red darken-3",
            });
          } else {
            M.toast({
              html: "Post added successfully",
              classes: "#43a047 green darken-1",
            });
            history.push("/");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    addPost();
  }, [url]);

  const createPost = async () => {
    try {
      M.toast({ html: "processing... please wait", classes: "blue darken-3" });
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
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="valign-wrapper row login-box">
      <div className="col card s10 pull-s1 pull-m3 l4 pull-l4">
        <div className="card-content">
          <span className="card-title">Add Post</span>
          <div className="row">
            <div className="file-field input-field col s12">
              <div className="btn btn-small blue-grey darken-2">
                <span>
                  <i className="material-icons left">file_upload</i> Image
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
              <textarea
                id="description"
                className="materialize-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              ></textarea>
              <label htmlFor="description">Description</label>
            </div>
          </div>
        </div>
        <div className="card-action right-align">
          <a href="/" className="btn-flat blue-text">
            Home
          </a>
          <button
            className="btn blue darken-2 waves-effect waves-light"
            onClick={() => createPost()}
          >
            Send Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
