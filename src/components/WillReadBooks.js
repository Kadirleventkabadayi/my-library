import Bookshelf from "./Bookshelf";
import { useEffect, useState } from "react";
import classes from "./ReadBooks.module.css";

const WillReadBooks = ({ bookList, collection, docId }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    bookList.then((bookData) => {
      // bookData kullanarak yapmak istediğiniz işlemleri burada gerçekleştirin
      console.log(bookData);
      setBooks(bookData); // State'i güncelleyerek component'i yeniden render edebilirsiniz
    });
  }, [bookList]);

  return (
    <div className={classes.container}>
      <Bookshelf
        shelfName="Will Read"
        bookList={books}
        collection={collection}
        docId={docId}
      ></Bookshelf>
    </div>
  );
};
export default WillReadBooks;
