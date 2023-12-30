import classes from "./RegisterForm.module.css";
import { useEffect, useState } from "react";
import { auth, provider, register } from "../config/FireBase";
import { signInWithPopup, sendEmailVerification } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContex";

function RegisterForm() {
  const { user, setUser } = useUser();
  const [accessToken, setAccessToken] = useState("");

  const navigate = useNavigate();

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const registerHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(registerEmail, registerPassword);
      setAccessToken(user.accessToken);
      setUser(user);
      sendEmailVerification(user).then(() =>
        console.log("Email Doğrulama gönderildi!")
      );
      console.log("REGISTER FORM: ", user);
      localStorage.setItem("accessToken", user.accessToken);
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
            <h1>Sign Up</h1>
          </div>
          <div>
            <p style={{ color: "#8D8D8D" }}>Have An Account ?</p>
            <Link to="/signin" relative="route" style={{ color: "#1D5D9B" }}>
              Sign In
            </Link>
          </div>
        </div>
        <form className={classes.form} onSubmit={registerHandleSubmit}>
          <p className={classes.leftAlign}>Enter your email address</p>
          <input
            type="text"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <p className={classes.leftAlign}>Create a Password</p>
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button
            className={classes.registerBtn}
            disabled={!registerEmail || !registerPassword}
            type="submit"
          >
            SIGN UP
          </button>
          <h5 style={{ color: "#ABABAB" }}>OR</h5>
          <button className={classes.googleBtn} onClick={handleClick}>
            Sign up With Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
