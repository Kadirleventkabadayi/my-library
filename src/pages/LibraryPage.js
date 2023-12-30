import React, { useState } from "react";
import AlreadyReadBooks from "../components/AlreadyReadBooks";
import FavoriteBooks from "../components/FavoriteBooks";
import WillReadBooks from "../components/WillReadBooks";
import { getBookList } from "../utils/GetBookList";
import { db } from "../config/FireBase";
import { useUser } from "../components/UserContex";
import styles from "./LibraryPage.module.css";

function LibraryPage() {
  const { user } = useUser();
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  const alreadyReadBooks = getBookList(db, "alreadyReadBooks", user.uid);
  const willReadBooks = getBookList(db, "willReadBooks", user.uid);
  const favoriteBooks = getBookList(db, "favoriteBooks", user.uid);

  const handleClick = (libraryType) => {
    if (selectedLibrary === libraryType) {
      setSelectedLibrary(null);
    } else {
      setSelectedLibrary(libraryType);
    }
  };

  const renderList = () => {
    if (selectedLibrary === "favorite") {
      return (
        <FavoriteBooks
          bookList={favoriteBooks}
          collection={"favoriteBooks"}
          docId={user.uid}
        />
      );
    } else if (selectedLibrary === "willRead") {
      return (
        <WillReadBooks
          bookList={willReadBooks}
          collection={"willReadBooks"}
          docId={user.uid}
        />
      );
    } else if (selectedLibrary === "alreadyRead") {
      return (
        <AlreadyReadBooks
          bookList={alreadyReadBooks}
          collection={"alreadyReadBooks"}
          docId={user.uid}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div className={styles.libraryContainer}>
        <div className={styles.libraryList}>
          <div
            className={`${styles.libraryListItem} ${
              selectedLibrary === "favorite" ? styles.selected : ""
            }`}
            onClick={() => handleClick("favorite")}
          >
            Favorite
          </div>
          <div
            className={`${styles.libraryListItem} ${
              selectedLibrary === "willRead" ? styles.selected : ""
            }`}
            onClick={() => handleClick("willRead")}
          >
            Will Read
          </div>
          <div
            className={`${styles.libraryListItem} ${
              selectedLibrary === "alreadyRead" ? styles.selected : ""
            }`}
            onClick={() => handleClick("alreadyRead")}
          >
            Already Read
          </div>
        </div>
        <div className={styles.libraryBookshelf}>{renderList()}</div>
      </div>
    </>
  );
}

export default LibraryPage;
