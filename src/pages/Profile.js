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
import { db, storage } from "../config/FireBase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { checkStorage } from "../utils/CheckStorage";
import { addUserToStore } from "../utils/AddUsersToStore";

const Profile = () => {
  const { user, setUser } = useUser();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [file, setFile] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      console.log("BURDA NE GELDİ", user);

      if (user) {
        const userPhotoRef = ref(storage, `/UserImages/${user.uid}`);
        const photoURL = await checkStorage(userPhotoRef);
        setNewPhotoURL(photoURL);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const uploadPhoto = async () => {
    if (file == null) return;

    const imgRef = ref(storage, `/UserImages/${auth.currentUser.uid}`);

    try {
      await uploadBytes(imgRef, file);
      alert("Is Done!");
      const photoURL = await getDownloadURL(imgRef);
      setNewPhotoURL(photoURL);
      if (auth.currentUser) {
        if (checkLengthName(newDisplayName)) {
          updateProfile(auth.currentUser, {
            photoURL: photoURL,
          })
            .then(() => {
              setUser(auth.currentUser);
              console.log("Kullanıcı profil bilgileri güncellendi");
              addUserToStore(db, "users", user.uid, user);
              // Inputları temizle
              setNewDisplayName("");
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
    } catch (error) {
      console.error("Upload error:", error.message);
    }
  };

  const handleUpdateProfile = () => {
    if (auth.currentUser) {
      if (checkLengthName(newDisplayName)) {
        updateProfile(auth.currentUser, {
          displayName: newDisplayName || auth.currentUser.displayName,
        })
          .then(() => {
            setUser(auth.currentUser);
            addUserToStore(db, "users", user.uid, user);
            console.log("Kullanıcı profil bilgileri güncellendi");
            // Inputları temizle
            setNewDisplayName("");
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
          addUserToStore(db, "users", user.uid, user);
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

  const toggleFileInput = () => {
    setIsVisible((prev) => !prev);
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
                  objectFit: "cover",
                }}
                //burda logic lazım eğer storage da var sa o yüklenecek yoksa orjinali
                src={newPhotoURL ? newPhotoURL : user?.photoURL}
                alt={user?.email}
              />

              <div
                onClick={toggleFileInput}
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
              {isVisible && (
                <div style={{ width: "50%", margin: "auto" }}>
                  <p className={classes.leftAlign}>Photo</p>

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "15%",
                    }}
                  >
                    <input
                      style={{
                        border: "solid",
                        borderColor: "#ccc",
                        borderWidth: "2px",
                        display: "inline-block",
                        cursor: "pointer",
                      }}
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    ></input>
                    <button
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                      onClick={uploadPhoto}
                    >
                      Upload Img
                    </button>
                  </div>
                </div>
              )}
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
