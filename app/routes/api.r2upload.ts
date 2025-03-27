// app/routes/api/r2upload.ts

import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { uploadFileToR2, uploadToR2, uploadVideoToR2 } from "~/utils/r2Upload"; // Adjust the import path as needed

export const action: ActionFunction = async ({ request }) => {
  // Parse the incoming multipart form data
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as string

  if (!file) {
    return json({ error: "No file provided" }, { status: 400 });
  }

  try {
    let mediaObject;
    if(type == 'image'){
        mediaObject = await uploadToR2(file, "image");
    }
    if(type == 'video'){
        mediaObject = await uploadVideoToR2(file)
    }
    if(type == 'file'){
        mediaObject = await uploadFileToR2(file)
    }

    // Call your upload function. You can adjust the type if needed (e.g., "video")

    return json(mediaObject);
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return json({ error: error.message || "Upload failed" }, { status: 500 });
  }
};
