import classes from "../components/LoginForm.module.css";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  updateProfile,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { CheckEmailVerification } from "../utils/CheckEmailVerification";
import { useUser } from "../components/UserContex";
import Camera from "../assets/Camera.svg";

const Profile = () => {
  const { user, setUser } = useUser();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const auth = getAuth();

  useEffect(() => {
    // Firebase Authentication tarafından sağlanan kullanıcı nesnesini al
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log("BURDA NE GELDİ", user);
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleUpdateProfile = () => {
    if (auth.currentUser) {
      if (checkLengthName(newDisplayName)) {
        updateProfile(auth.currentUser, {
          displayName: newDisplayName || auth.currentUser.displayName,
          photoURL: newPhotoURL || auth.currentUser.photoURL,
        })
          .then(() => {
            setUser(auth.currentUser);
            console.log("Kullanıcı profil bilgileri güncellendi");
            // Inputları temizle
            setNewDisplayName("");
            setNewPhotoURL("");
          })
          .catch((error) => {
            console.error(
              "Kullanıcı profil bilgileri güncellenirken bir hata oluştu",
              error
            );
          });
      } else {
        alert("İsimedki karakter sayısı 32 den fazla olamaz!");
      }
    }
  };

  const handleUpdateEmail = () => {
    if (auth.currentUser && newEmail.trim() !== "") {
      verifyBeforeUpdateEmail(auth.currentUser, newEmail)
        .then(() => {
          alert("Doğrulama e-postası gönderildi");
          // Inputları temizle
          setNewEmail("");
        })
        .catch((error) => {
          console.error(
            "Kullanıcı email adresini girerken bir hata oluştı",
            error
          );
        });
    }
  };

  const handleUpdatePassword = () => {
    if (auth.currentUser && newPassword.trim() !== "") {
      updatePassword(auth.currentUser, newPassword)
        .then(() => {
          alert("Şifre Değişti");
          // Inputları temizle
          setNewPassword("");
        })
        .catch((error) => {
          console.error(
            "Kullanıcı şifresi güncellenirken bir hata oluştu",
            error
          );
        });
    }
  };

  const checkLengthName = (name) => {
    if (name.length > 32) {
      return false;
    }
    return true;
  };

  return (
    <>
      <div
        style={{
          background: "#fffef9",
          height: "100vh",
          width: "100vw",
          paddingInline: "10%",
          paddingBlock: "2%",
        }}
      >
        <div style={{ margin: "0 10%" }} className={classes.container}>
          <div
            style={{ justifyContent: "center", display: "block" }}
            className={classes.formInfo}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1>
                {newDisplayName
                  ? newDisplayName
                  : user?.displayName
                  ? user?.displayName
                  : "My Profile"}
              </h1>
              <img
                style={{
                  border: "solid",
                  borderColor: "#1d5d9b",
                  width: "10vw",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                }}
                src={newPhotoURL ? newPhotoURL : user?.photoURL}
                alt={user?.email}
              />

              <div
                style={{
                  backgroundColor: "#F4D160",
                  width: "3vw",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                  bottom: "5vh",
                  left: "3vw",
                  display: "grid",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <img
                  style={{ width: "1.5vw", aspectRatio: "1/1" }}
                  src={Camera}
                  alt={Camera}
                ></img>
              </div>
            </div>
          </div>
          <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
            <p className={classes.leftAlign}>Display Name</p>
            <input
              type="text"
              placeholder="Display Name"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
            />
            <p className={classes.leftAlign}>Photo URL</p>
            <input
              type="text"
              placeholder="Photo URL"
              value={newPhotoURL}
              onChange={(e) => setNewPhotoURL(e.target.value)}
            />
            <button
              className={classes.loginBtn}
              disabled={!CheckEmailVerification(user)}
              onClick={
                CheckEmailVerification(user) ? handleUpdateProfile : null
              }
              type="button"
            >
              Update Profile
            </button>
            <p className={classes.leftAlign}>New Email</p>
            <input
              type="text"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button
              className={classes.loginBtn}
              disabled={!CheckEmailVerification(user)}
              onClick={CheckEmailVerification(user) ? handleUpdateEmail : null}
              type="button"
            >
              Update Email
            </button>

            <p className={classes.leftAlign}>New Password</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className={classes.loginBtn}
              disabled={!CheckEmailVerification(user)}
              onClick={
                CheckEmailVerification(user) ? handleUpdatePassword : null
              }
              type="button"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
