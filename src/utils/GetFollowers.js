import { doc, getDoc } from "firebase/firestore";

export const getFollowers = async (db, collectionPath, documentId) => {
  const docRef = doc(db, collectionPath, documentId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const followersData = docSnap.data();
      console.log("Takipçi listesi başarıyla alındı:", followersData);

      return followersData.followers.map((u) => u.userId);
    } else {
      console.log("Belirtilen belge bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Takipçi listesini alırken hata oluştu:", error);
    return null;
  }
};
