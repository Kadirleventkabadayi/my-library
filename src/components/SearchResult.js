import { Link } from "react-router-dom";
import classes from "./SearchResult.module.css";

function SearchResult(props) {
  const handleClick = () => {
    props.setResults([]);
  };

  return (
    <Link
      to={props.result.id}
      className={classes.searchResult}
      onClick={handleClick}
    >
      {props.result.volumeInfo.title}
    </Link>
  );
}

export default SearchResult;
