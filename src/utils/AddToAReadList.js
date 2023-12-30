import { setDoc, doc, updateDoc } from "firebase/firestore";
import { checkDocumentExistence } from "./CheckDocumentExistence";

export const addToAReadListHandler = async (
  db,
  collectionPath,
  documentId,
  book,
  title
) => {
  const docRef = doc(db, collectionPath, documentId);
  const userToken = localStorage.getItem("accessToken");

  const match = book.previewLink.match(/books\?id=([^\&]+)/);

  const bookId = match ? match[1] : null;

  if (!userToken) {
    console.error("Kullanıcı oturum açmamış");
    return;
  }

  try {
    console.log({ [title]: book.imageLinks.smallThumbnail });
    const res = await checkDocumentExistence(collectionPath, documentId, db);
    console.log(res);

    if (res) {
      await updateDoc(docRef, {
        [title]: book.imageLinks.smallThumbnail,
        [title + "_id"]: bookId,
      });
    } else {
      await setDoc(docRef, {
        [title]: book.imageLinks.smallThumbnail,
        [title + "_id"]: bookId,
      });
    }

    console.log("Kitap başarıyla eklenmiştir.");
  } catch (error) {
    console.error("Kitap eklerken hata oluştu:", error);
  }
};
