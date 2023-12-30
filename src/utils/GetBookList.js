import { doc, getDoc } from "firebase/firestore";

export const getBookList = async (db, collectionPath, documentId) => {
  const docRef = doc(db, collectionPath, documentId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const bookListData = docSnap.data();
      console.log("Kitap listesi başarıyla alındı:", bookListData);

      return bookListData;
    } else {
      console.log("Belirtilen belge bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Kitap listesini alırken hata oluştu:", error);
    return null;
  }
};
