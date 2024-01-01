import classes from "./bookItem.module.css";
import { addToAReadListHandler } from "../utils/AddToAReadList";
import { auth, db } from "../config/FireBase";
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
import { getDoc, doc } from "firebase/firestore";

function BookItem({ book, selfLink, id }) {
  const { user } = useUser();
  const { title, authors, publishedDate, description, imageLinks } = book;
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [hoverResults, setHoverResults] = useState([]);

  const hoverEffect = async (collectionPath, docId) => {
    const user = auth.currentUser;
    if (user && user.uid) {
      try {
        const docRef = doc(db, collectionPath, docId);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (data.hasOwnProperty(book.title)) {
          return true;
        }
        return false;
      } catch (error) {
        console.error("Kontrol yapılırken hata oluştu:", error);
      }
    }
    return false;
  };

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

    const fetchHoverResults = async () => {
      const pathsToCheck = [
        "alreadyReadBooks",
        "willReadBooks",
        "favoriteBooks",
      ];
      const results = await Promise.all(
        pathsToCheck.map((path) => hoverEffect(path, user.uid))
      );
      setHoverResults(results);
      console.log(results);
    };
    fetchHoverResults();
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
  const handleAddToReadList = async (collectionPath, index) => {
    if (user) {
      addToAReadListHandler(db, collectionPath, user.uid, book, title);
      // Update hoverResults to set the clicked index to true
      setHoverResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = true;
        return newResults;
      });
    } else {
      alert("Please Sign In!");
    }
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
              {title}
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
                style={
                  hoverResults[0]
                    ? { color: "#1d5d9b", borderColor: "#1d5d9b" }
                    : {}
                }
                onClick={() => handleAddToReadList("alreadyReadBooks", 0)}
              >
                <img
                  src={hoverResults[0] ? AlreadyReadHover : AlreadyRead}
                  alt="Already Read"
                  className={classes.icon}
                />
                <img
                  src={hoverResults[0] ? AlreadyRead : AlreadyReadHover}
                  alt="Already Read Hover"
                  className={classes.hoverIcon}
                />
                Already Read
              </h4>
              <h4
                style={
                  hoverResults[1]
                    ? { color: "#1d5d9b", borderColor: "#1d5d9b" }
                    : {}
                }
                onClick={() => handleAddToReadList("willReadBooks", 1)}
              >
                <img
                  src={hoverResults[1] ? WillReadHover : WillRead}
                  alt="Will Read"
                  className={classes.icon}
                />
                <img
                  src={hoverResults[1] ? WillRead : WillReadHover}
                  alt="Will Read Hover"
                  className={classes.hoverIcon}
                />
                Will Read
              </h4>

              <h4
                style={
                  hoverResults[2]
                    ? { color: "#1d5d9b", borderColor: "#1d5d9b" }
                    : {}
                }
                onClick={() => handleAddToReadList("favoriteBooks", 2)}
              >
                <img
                  src={hoverResults[2] ? FavoriteHover : Favorite}
                  alt="Favorite"
                  className={classes.icon}
                />
                <img
                  src={hoverResults[2] ? Favorite : FavoriteHover}
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
