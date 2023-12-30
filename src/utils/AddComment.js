import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { checkDocumentExistence } from "./CheckDocumentExistence";

export const addCommentHandler = async (
  db,
  collectionPath,
  documentId,
  user
) => {
  const docRef = doc(db, collectionPath, documentId);
  const userToken = localStorage.getItem("accessToken");
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  if (user.comment) {
    if (!userToken) {
      console.error("Kullanıcı oturum açmamış");
      return;
    }

    try {
      const res = await checkDocumentExistence(collectionPath, documentId, db);
      console.log(res);

      if (res) {
        // Belge zaten varsa, mevcut veriyi al ve yeni yorumu ekleyerek güncelle
        const docSnapshot = await getDoc(docRef);
        const existingComments = docSnapshot.data().comments || [];

        await updateDoc(docRef, {
          comments: [
            ...existingComments,
            {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
              photoURL: user.photoURL,
              comment: user.comment,
              date: todayDate,
            },
          ],
        });
      } else {
        // Belge yoksa, yeni belgeyi oluştur ve yorumu ekleyerek kaydet
        await setDoc(docRef, {
          comments: [
            {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
              photoURL: user.photoURL,
              comment: user.comment,
              date: todayDate,
            },
          ],
        });
      }

      console.log("Yorum başarıyla eklenmiştir.");
    } catch (error) {
      console.error("Yorum eklerken hata oluştu:", error);
    }
  } else {
    console.log("Boş yorum yapılamaz!");
    alert("This Comment Isn't Allowed!");
  }
};
