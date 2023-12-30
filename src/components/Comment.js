// Comment.js

import classes from "./Comment.module.css";

function Comment({ comment }) {
  const trimUserName = (userName) => {
    const trimmedName = userName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    return trimmedName;
  };

  const trimEmail = (email) => {
    const trimmedEmail = email.split("@")[0];
    return trimmedEmail;
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.userimgdiv}>
          {comment.photoURL ? (
            <img src={comment.photoURL} alt={comment.email} />
          ) : (
            <h3>
              {trimUserName(
                comment.displayName ? comment.displayName : comment.email
              )}
            </h3>
          )}
        </div>
        <div className={classes.userandcomment}>
          <div className={classes.useranddate}>
            <h4>
              {comment.displayName
                ? comment.displayName
                : trimEmail(comment.email)}
            </h4>
            <h5>{comment.date}</h5>
          </div>
          <div className={classes.comment}>
            <p>{comment.comment}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
