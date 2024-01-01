import { doc, getDoc } from "firebase/firestore";

export const getUsersInfo = async (db, collectionPath, documentIds) => {
  try {
    const userPromises = documentIds.map(async (documentId) => {
      const docRef = doc(db, collectionPath, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("User bilgisi başarıyla alındı:", userData);
        return userData;
      } else {
        console.log(`Belirtilen belge (${documentId}) bulunamadı.`);
        return null;
      }
    });

    // Tüm kullanıcı bilgisi promise'ları tamamlanana kadar bekleyin
    const usersData = await Promise.all(userPromises);

    // usersData dizisinde null olanları filtrele
    const validUsersData = usersData.filter((userData) => userData !== null);

    return validUsersData;
  } catch (error) {
    console.error("User bilgisini alırken hata oluştu:", error);
    return null;
  }
};
