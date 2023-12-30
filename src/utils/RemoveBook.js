import { deleteField, updateDoc } from "firebase/firestore";

export const RemoveBook = async (docRef, bookName) => {
  try {
    await updateDoc(docRef, {
      [bookName]: deleteField(),
      [`${bookName}_id`]: deleteField(),
    });

    console.log(`${bookName} removed successfully.`);
  } catch (error) {
    console.error("Error removing book:", error);
  }
};
