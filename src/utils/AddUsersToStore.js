import { setDoc, doc, updateDoc } from "firebase/firestore";
import { checkDocumentExistence } from "./CheckDocumentExistence";

export const addUserToStore = async (db, collectionPath, documentId, user) => {
  const docRef = doc(db, collectionPath, documentId);

  try {
    const res = await checkDocumentExistence(collectionPath, documentId, db);
    console.log(res);

    if (res) {
      await updateDoc(docRef, {
        accessToken: user.accessToken,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    } else {
      await setDoc(docRef, {
        accessToken: user.accessToken,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    }

    console.log("user eklendi Başarılı");
    return true;
  } catch (error) {
    console.error("user ekleme esnasında ----------- ", error);
    return false;
  }
};
