import { useState } from "react";
import classes from "./Accordion.module.css";

const Accordion = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={classes.accordionItem}>
      <div
        className={classes.accordionTitle}
        onClick={() => setIsActive((prevIsActive) => !prevIsActive)}
      >
        <div className={classes.accordionSearchTitle}>{title}</div>
        <div className={classes.accordionBtn}>{isActive ? "-" : "+"}</div>
      </div>
      {isActive && <div className={classes.accordionContent}>{content}</div>}
    </div>
  );
};

export default Accordion;
