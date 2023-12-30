import classes from "./LoginForm.module.css";
import { useEffect, useState } from "react";
import { auth, provider, login } from "../config/FireBase";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContex";

function LoginForm() {
  const { user, setUser } = useUser();
  const [accessToken, setAccessToken] = useState("");

  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const loginHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(loginEmail, loginPassword);
      console.log(data);
      setUser(data);
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    } catch (error) {
      console.error("Hata:", error.message);
    }
  };

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      console.log(data.user);
      setAccessToken(data.user.accessToken);
      setUser(data.user);
      console.log("user basılacak: ", user);
      localStorage.setItem("accessToken", data.user.accessToken);
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
      auth.onAuthStateChanged((user) => {
        setUser(user);
        console.log("DENEME", user);
      });
      navigate("/");
      console.log("effect: ", user);
      console.log("effect token: ", accessToken);
    }
  }, [user]);

  return (
    <div className={classes.allForm}>
      <div className={classes.container}>
        <div className={classes.formInfo}>
          <div>
            <h3>Welcome to Library</h3>
            <h1>Sign in</h1>
          </div>
          <div>
            <p style={{ color: "#8D8D8D" }}>No Account ?</p>
            <Link to="/signup" relative="route" style={{ color: "#1D5D9B" }}>
              Sign Up
            </Link>
          </div>
        </div>
        <form className={classes.form} onSubmit={loginHandleSubmit}>
          <p className={classes.leftAlign}>Enter your email address</p>
          <input
            type="text"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <p className={classes.leftAlign}>Enter your Password</p>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <p className={classes.rightAlign}>Forgot Password</p>
          <button
            className={classes.loginBtn}
            disabled={!loginEmail || !loginPassword}
            type="submit"
          >
            LOGIN
          </button>
          <h5 style={{ color: "#ABABAB" }}>OR</h5>
          <button className={classes.googleBtn} onClick={handleClick}>
            Sign in With Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
