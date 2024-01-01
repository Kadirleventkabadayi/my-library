import { getDownloadURL } from "firebase/storage";

export const checkStorage = async (ref) => {
  try {
    const photoURL = await getDownloadURL(ref);
    return photoURL;
  } catch (error) {
    console.error("Upload error:", error.message);
  }
};
