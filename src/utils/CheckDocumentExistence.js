import { doc, getDoc } from "firebase/firestore";

export const checkDocumentExistence = async (
  collectionPath,
  documentId,
  db
) => {
  const docRef = doc(db, collectionPath, documentId);
  try {
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists();
  } catch (error) {
    console.error("Error checking document existence:", error);
    return false;
  }
};
