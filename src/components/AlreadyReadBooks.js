import Bookshelf from "./Bookshelf";
import { useEffect, useState } from "react";
import classes from "./ReadBooks.module.css";

const AlreadyReadBooks = ({ bookList, collection, docId }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    bookList.then((bookData) => {
      console.log(bookData);
      setBooks(bookData);
    });
  }, [bookList]);

  return (
    <div className={classes.container}>
      <Bookshelf
        shelfName="Already Read"
        bookList={books}
        collection={collection}
        docId={docId}
      ></Bookshelf>
    </div>
  );
};

export default AlreadyReadBooks;
