import SearchBar from "./SearchBar";
import classes from "./InfoArea.module.css";
import { useState } from "react";
import SearchResultsList from "./SearchResultsList";
import Accordion from "./Accordion";

function InfoArea() {
  const [results, setResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("title");

  return (
    <div className={classes.container}>
      <div className={classes.textInfo}>
        <div>
          <div className={classes.vector}></div>
          <h1>
            Get Your <span style={{ color: "#1D5D9B" }}>New Book</span>
            <br />
            And Online Library <br />
            With The Best Price
          </h1>
          <p>
            Find your books explore over 300,000 textbooks online and
            non-fiction title in
            <br /> every subject start with two weeks free
          </p>
        </div>
        <div className={classes.searchContainer}>
          <div>
            <SearchBar
              filter={selectedFilter}
              setResults={setResults}
              className={classes.searchBar}
            />
            <SearchResultsList setResults={setResults} results={results} />
          </div>
          <Accordion
            title={
              selectedFilter === "title"
                ? "Title"
                : selectedFilter === "authors"
                ? "Authors"
                : "Date"
            }
            content={
              <ul>
                <li
                  className={
                    selectedFilter === "title" ? classes.selectedFilter : ""
                  }
                  onClick={() => {
                    setSelectedFilter("title");
                  }}
                >
                  Title
                </li>
                <li
                  className={
                    selectedFilter === "authors" ? classes.selectedFilter : ""
                  }
                  onClick={() => {
                    setSelectedFilter("authors");
                  }}
                >
                  Author
                </li>
                <li
                  className={
                    selectedFilter === "publishedDate"
                      ? classes.selectedFilter
                      : ""
                  }
                  onClick={() => {
                    setSelectedFilter("publishedDate");
                  }}
                >
                  Date
                </li>
              </ul>
            }
            controllerElement={(isExpanded) => (
              <button>{isExpanded ? "Hide" : "Show"} Content</button>
            )}
          />
        </div>
      </div>
      <div className={classes.imageContainer}></div>
    </div>
  );
}

export default InfoArea;
