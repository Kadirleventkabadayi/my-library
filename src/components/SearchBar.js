import React, { useState } from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ setResults, filter }) => {
  const [searchInput, setSearchInput] = useState("");

  const apiKey = "AIzaSyBaAaijdYTvKhJIuj_l_LL_9wDzto2eOeM";
  const maxResults = 40;

  const url = `https://www.googleapis.com/books/v1/volumes?q=search+terms&key=${apiKey}&maxResults=${maxResults}`;

  async function fetchData(searchValue) {
    const searchTerm = searchValue.toLowerCase();

    if (!searchTerm || searchTerm === "") {
      setResults([]);
      return [];
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (filter === "authors") {
        //burda authors ile serach halledilecek
        const filteredResults = data.items
          .filter((item) => {
            const authors = item.volumeInfo.authors;

            // Eğer authors bir dizi değilse veya boşsa, realData'ya boş bir dizi ata
            const realData = Array.isArray(authors)
              ? authors.join(" ")
              : authors || "";

            return realData.toLowerCase().includes(searchTerm);
            // const realData = temp.map((author) => {
            //   author.toLowerCase().includes(searchTerm);
            // });
            // console.log(realData);
          })
          .map((item) => item);
        setResults(filteredResults);
        console.log(filter);
      } else {
        const filteredResults = data.items
          .filter((item) => {
            // Belirtilen özellik `item.volumeInfo` içinde bulunuyorsa filtreleme yap
            if (item.volumeInfo && item.volumeInfo[filter]) {
              return item.volumeInfo[filter].toLowerCase().includes(searchTerm);
            }
            return false; // Eğer belirtilen özellik yoksa bu öğeyi filtreleme
          })
          .map((item) => item);

        setResults(filteredResults);
        console.log(filter);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
      return [];
    }
  }

  const onChangeHeandler = (value) => {
    setSearchInput(value);
    fetchData(value);
  };

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        placeholder="Search"
        className={styles.searchInput}
        value={searchInput}
        onChange={(e) => {
          onChangeHeandler(e.target.value);
        }}
      />
      <button className={styles.searchButton}>Search</button>
    </div>
  );
};

export default SearchBar;
