import classes from "./bookItem.module.css";
import { addToAReadListHandler } from "../utils/AddToAReadList";
import { db } from "../config/FireBase";
import Comment from "./Comment";
import AlreadyRead from "../assets/AlreadyRead.svg";
import AlreadyReadHover from "../assets/AlreadyReadHover.svg";
import WillRead from "../assets/WillRead.svg";
import WillReadHover from "../assets/WillReadHover.svg";
import Favorite from "../assets/Favorite.svg";
import FavoriteHover from "../assets/FavoriteHover.svg";
import { useUser } from "./UserContex";
import { useEffect, useState } from "react";
import { addCommentHandler } from "../utils/AddComment";
import { getComments } from "../utils/GetComments";
function BookItem({ book, selfLink, id }) {
  const { user } = useUser();
  const { title, authors, publishedDate, description, imageLinks } = book;
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const checkUser = (user) => {
    return user !== null
      ? user
      : localStorage.getItem("accessToken") !== null
      ? "Get user info with token"
      : false;
  };

  const simpleUser = {
    displayName: checkUser(user).displayName,
    email: checkUser(user).email,
    uid: checkUser(user).uid,
    photoURL: checkUser(user).photoURL,
    comment: commentText,
  };

  useEffect(() => {
    // Sayfa yüklendiğinde yorumları al
    const fetchComments = async () => {
      const commentsFromFirestore = await getComments(db, "booksComments", id);
      setComments(commentsFromFirestore);
    };
    fetchComments();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    if (user) {
      // Firestore'a yorumu ekleyin
      await addCommentHandler(db, "booksComments", id, simpleUser);

      // Yorumlar listesini güncelle
      const updatedComments = await getComments(db, "booksComments", id);
      setComments(updatedComments);
    } else {
      alert("Plase Sign in!");
    }
    setCommentText(""); // Form gönderildikten sonra metni sıfırla
  };

  return (
    <>
      <div className={classes.base}>
        <div className={classes.container}>
          <div className={classes.imgdiv}>
            <img
              src={
                book.imageLinks
                  ? imageLinks?.thumbnail
                  : "https://www.vhv.rs/dpng/d/492-4923040_book-image-no-copyright-hd-png-download.png"
              }
              alt={title}
            />
          </div>
          <div className={classes.book}>
            <h2 className={classes.BookTitle}>
              {title}{" "}
              <p className={classes.BookInfo}>
                {publishedDate ? `(${publishedDate})` : ""}
              </p>
            </h2>
            <p className={classes.BookInfo}>
              {authors ? authors.join(", ") : "Unknown"}
            </p>
            <div
              className={classes.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div className={classes.addlist}>
              <h4
                onClick={() =>
                  user
                    ? addToAReadListHandler(
                        db,
                        "alreadyReadBooks",
                        user.uid,
                        book,
                        title
                      )
                    : alert("Plase Sign İn!")
                }
              >
                <img
                  src={AlreadyRead}
                  alt="Already Read"
                  className={classes.icon}
                />
                <img
                  src={AlreadyReadHover}
                  alt="Already Read Hover"
                  className={classes.hoverIcon}
                />
                Already Read
              </h4>
              <h4
                onClick={() =>
                  user
                    ? addToAReadListHandler(
                        db,
                        "willReadBooks",
                        user.uid,
                        book,
                        title
                      )
                    : alert("Plase Sign İn!")
                }
              >
                <img src={WillRead} alt="Will Read" className={classes.icon} />
                <img
                  src={WillReadHover}
                  alt="Will Read Hover"
                  className={classes.hoverIcon}
                />
                Will Read
              </h4>
              <h4
                onClick={() =>
                  user
                    ? addToAReadListHandler(
                        db,
                        "favoriteBooks",
                        user.uid,
                        book,
                        title
                      )
                    : alert("Plase Sign İn!")
                }
              >
                <img src={Favorite} alt="Favorite" className={classes.icon} />
                <img
                  src={FavoriteHover}
                  alt="Favorite Hover"
                  className={classes.hoverIcon}
                />
                Favorite
              </h4>
            </div>
          </div>
        </div>
        <div className={classes.commentdiv}>
          <form onSubmit={handleSubmit}>
            <textarea
              type="text"
              placeholder="Add Comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <Comment comment={comment} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default BookItem;
