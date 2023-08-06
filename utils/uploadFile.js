import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";

const uploadFile = async ({ path, photo, name = false }) => {
  try {
    const response = await fetch(photo);

    const file = await response.blob();

    const uniqueId = name ? name : Date.now().toString();

    const storageRef = ref(storage, `${path}/${uniqueId}`);

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.warn("uploadFile ERROR", error);
  }
};

export default uploadFile;
