import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/src/lib/firebase/clientApp";

import { updateTrailImageReference } from "@/src/lib/firebase/firestore";

export async function updateTrailImage(trailId, image) {
  try {
    // Validate inputs before creating storage paths or making network requests.
    if (!trailId) {
      throw new Error("No trail ID has been provided.");
    }

    if (!image || !image.name) {
      throw new Error("A valid image has not been provided.");
    }

    // Persist the file, then save its download URL to the trail document.
    const publicImageUrl = await uploadImage(trailId, image);
    await updateTrailImageReference(trailId, publicImageUrl);

    return publicImageUrl;
  } catch (error) {
    console.error("Error processing request:", error);
  }
}

async function uploadImage(trailId, image) {
  // Keep each trail's image under its own storage directory.
  const filePath = `images/${trailId}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}
