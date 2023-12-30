import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import classes from "./MainNavihation.module.css";
import { useUser } from "./UserContex";

function MainNavigation() {
  const { user } = useUser();
  const location = useLocation();
  const [goTop, setGoTop] = useState(1);

  useEffect(() => {
    if (location.pathname === "/") {
      if (goTop === 1) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else if (goTop === 2) {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }
    } else {
      setGoTop(undefined);
    }
  }, [location, goTop]);

  return (
    <header className={classes.header}>
      <div
        className={classes.logoConteiner}
        style={{
          display: "flex",
          alignSelf: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div className={classes.logo}></div>
        {/* burası NavLink olucak */}
        <p className={classes.name}>BOOKS</p>
      </div>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              onClick={() => setGoTop(1)}
              className={({ isActive }) =>
                isActive && goTop === 1 ? classes.active : undefined
              }
            >
              Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              onClick={() => setGoTop(2)}
              className={({ isActive }) =>
                isActive && goTop === 2 ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Profile
            </NavLink>
          </li>
          <li>
            {user ? (
              <NavLink to="library" className={classes.library}>
                My Library
              </NavLink>
            ) : (
              <NavLink to="signin" className={classes.library}>
                Sign In
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
