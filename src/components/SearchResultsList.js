import SearchResult from "./SearchResult";
import classes from "./SearchResultsList.module.css";

function SearchResultsList(props) {
  return (
    <div
      className={
        props.results.length === 0 ? classes.noResult : classes.resultsList
      }
    >
      {props.results.map((result, id) => {
        return (
          <SearchResult
            setResults={props.setResults}
            result={result}
            key={id}
          />
        );
      })}
    </div>
  );
}

export default SearchResultsList;
