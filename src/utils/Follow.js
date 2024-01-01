import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { checkDocumentExistence } from "./CheckDocumentExistence";

export const follow = async (db, collectionPath, documentId, userId) => {
  const docRef = doc(db, collectionPath, documentId);
  const userToken = localStorage.getItem("accessToken");

  if (!userToken) {
    console.error("Kullanıcı oturum açmamış");
    alert("Kullanıcı oturum açmamış");
    return false;
  }
  if (documentId === userId) {
    console.error("Kendini takip edemez");
    alert("Kendini Takip Edemezsin!");
    return false;
  }

  try {
    const res = await checkDocumentExistence(collectionPath, documentId, db);
    console.log(res);

    if (res) {
      // If the document exists, update the "followers" array
      await updateDoc(docRef, {
        followers: arrayUnion({ userId: userId }),
      });
    } else {
      // If the document doesn't exist, set the "followers" array
      await setDoc(docRef, { followers: [{ userId: userId }] });
    }

    console.log("Takip Başarılı");
    return true;
  } catch (error) {
    console.error("Takip esnasında", error);
    return false;
  }
};
