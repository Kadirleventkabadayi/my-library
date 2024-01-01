import React, { useEffect, useState } from "react";
import AlreadyReadBooks from "../components/AlreadyReadBooks";
import FavoriteBooks from "../components/FavoriteBooks";
import WillReadBooks from "../components/WillReadBooks";
import { getBookList } from "../utils/GetBookList";
import { auth, db, storage } from "../config/FireBase";
import { useUser } from "../components/UserContex";
import styles from "./LibraryPage.module.css";
import { follow } from "../utils/Follow";
import { getFollowers } from "../utils/GetFollowers";
import { getUsersInfo } from "../utils/GetUsersInfo";

function LibraryPage() {
  const { user } = useUser();
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [toggleFollows, setToggleFollows] = useState(false);

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

  const followHandle = async () => {
    follow(db, "follows", user.uid, "C0Hv3mXNIkYQbVJhA8oH8qsMKXH2");
  };

  const getFollowersHandle = async () => {
    try {
      const folls = await getFollowers(db, "follows", user.uid);
      setFollowers(folls);
      fetchUserProfiles();
    } catch (error) {
      console.error("Error getting followers:", error);
    }
  };

  const fetchUserProfiles = async () => {
    const profiles = [];
    try {
      const usersData = await getUsersInfo(db, "users", followers);
      profiles.push(...usersData);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
    setUserProfiles(profiles);
  };

  useEffect(() => {
    getFollowersHandle();
  }, []);

  useEffect(() => {
    fetchUserProfiles();
  }, [followers]);
  return (
    <>
      <div className={styles.libraryContainer}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginInlineEnd: "65%",
          }}
        >
          <img
            style={{
              border: "solid",
              borderColor: "#1d5d9b",
              width: "4vw",
              aspectRatio: "1/1",
              borderRadius: "50%",
              objectFit: "cover",
              marginInlineEnd: "2%",
            }}
            src={user.photoURL}
            alt={user.email}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "15%",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label>{user.displayName ? user.displayName : user.email}</label>
            </div>
            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "40%",
                  cursor: "pointer",
                }}
              >
                <p style={{ padding: 0, margin: 0 }}>Takipçi</p>
                {followers.length}
              </label>
              <label
                onClick={() => setToggleFollows((prev) => !prev)}
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "40%",
                  cursor: "pointer",
                }}
              >
                <p style={{ padding: 0, margin: 0 }}>Takip</p>
                {followers.length}
              </label>
            </div>
          </div>
          <button onClick={followHandle}>takip et</button>
        </div>
        {toggleFollows && (
          <div style={{ marginInlineEnd: "65%" }}>
            <ul>
              {userProfiles.map((user) => (
                <li
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                  key={user.email}
                >
                  <img
                    style={{
                      cursor: "pointer",
                      border: "solid",
                      borderColor: "#1d5d9b",
                      width: "2vw",
                      aspectRatio: "1/1",
                      borderRadius: "50%",
                      objectFit: "cover",
                      margin: "1%",
                    }}
                    src={user.photoURL}
                    alt={user.email}
                  />
                  <label>{user.email}</label>
                </li>
              ))}
            </ul>
          </div>
        )}
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
