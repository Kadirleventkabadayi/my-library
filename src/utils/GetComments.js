import { doc, getDoc } from "firebase/firestore";

export const getComments = async (db, collectionPath, documentId) => {
  const docRef = doc(db, collectionPath, documentId);

  try {
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const comments = docSnapshot.data().comments || [];
      return comments;
    } else {
      console.log("Belge bulunamadı.");
      return [];
    }
  } catch (error) {
    console.error("Yorumları getirirken hata oluştu:", error);
    return [];
  }
};
