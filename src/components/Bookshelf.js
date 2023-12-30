import React, { useState, useEffect } from "react";
import classes from "./Bookshelf.module.css";
import { Link } from "react-router-dom";
import { doc } from "firebase/firestore";
import { db } from "../config/FireBase";
import { RemoveBook } from "../utils/RemoveBook";

const Bookshelf = ({ collection, docId, bookList, shelfName }) => {
  const docRef = doc(db, collection, docId);
  const [books, setBooks] = useState({
    bookNames: [],
    imageLinks: [],
    Ids: [],
  });

  useEffect(() => {
    function divideData(veri) {
      const bookNames = [];
      const imageLinks = [];
      const Ids = [];
      const denemeIdname = [];

      Object.keys(veri).forEach((data) => {
        if (data.includes("_id")) {
          denemeIdname.push(data);
        } else {
          bookNames.push(data);
          imageLinks.push(veri[data]);
          const idKey = `${data}_id`;
          Ids.push(veri[idKey]);
        }
      });

      console.log("bookNames: ", bookNames);
      console.log("imageLinks: ", imageLinks);
      console.log("Ids: ", Ids);
      console.log("denemeIdname: ", denemeIdname);

      return {
        bookNames,
        imageLinks,
        Ids,
      };
    }
    setBooks(divideData(bookList));
  }, [bookList]);

  const removeHandler = (docRef, bookName) => {
    RemoveBook(docRef, bookName);
    setBooks((prevBooks) => {
      const bookIndex = prevBooks.bookNames.indexOf(bookName);

      if (bookIndex !== -1) {
        const newBookNames = [...prevBooks.bookNames];
        const newImageLinks = [...prevBooks.imageLinks];
        const newIds = [...prevBooks.Ids];

        newBookNames.splice(bookIndex, 1);
        newImageLinks.splice(bookIndex, 1);
        newIds.splice(bookIndex, 1);

        return {
          bookNames: newBookNames,
          imageLinks: newImageLinks,
          Ids: newIds,
        };
      }

      return prevBooks;
    });
  };

  return (
    <div className={classes.bookshelfWrapper}>
      <div className={classes.bookshelfList}>
        <ul>
          {books.bookNames.map((bookName, index) => (
            <li key={index}>
              <Link to={`/${books.Ids[index]}`}>
                <img
                  className={classes.Imgs}
                  src={books.imageLinks[index]}
                  alt={bookName}
                />
              </Link>
            </li>
          ))}
        </ul>
        <ul className={classes.bookActions}>
          {books.bookNames.map((bookName, index) => (
            <li
              style={{ width: "15vw" }}
              className={classes.bookItem}
              key={index}
            >
              {bookName}
              <button
                className={classes.bookshelfButton}
                onClick={() => {
                  removeHandler(docRef, bookName);
                }}
              >
                Remove -
              </button>
              {shelfName === "Already Read" && (
                <button className={classes.bookshelfButton}>Add Note</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bookshelf;
