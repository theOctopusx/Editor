/* eslint-disable @typescript-eslint/no-explicit-any */
// app/routes/api/r2upload.ts

import type { ActionFunction } from "@remix-run/node"; // Import ActionFunction type for defining the route action
import { json } from "@remix-run/node"; // Import json utility to send JSON responses
import { uploadFileToR2, uploadToR2, uploadVideoToR2 } from "~/utils/r2Upload"; // Import the upload functions from utils

// Define the action function that handles the file upload
export const action: ActionFunction = async ({ request }) => {
  // Parse the incoming multipart form data from the request
  const formData = await request.formData();
  
  // Extract the file from the form data
  const file = formData.get("file") as File;
  
  // Extract the type of file being uploaded (image, video, or file)
  const type = formData.get("type") as string;

  // Check if no file was provided in the request
  if (!file) {
    // Return a JSON response with an error if no file is provided
    return json({ error: "No file provided" }, { status: 400 });
  }

  try {
    let mediaObject;

    // Depending on the file type, call the appropriate upload function
    if (type === 'image') {
      // Upload image file to R2 storage
      mediaObject = await uploadToR2(file, "image");
    }
    
    if (type === 'video') {
      // Upload video file to R2 storage
      mediaObject = await uploadVideoToR2(file);
    }

    if (type === 'file') {
      // Upload a general file to R2 storage
      mediaObject = await uploadFileToR2(file);
    }

    // Return the media object containing the file metadata as a JSON response
    return json(mediaObject);
  } catch (error: any) {
    // Log the error to the console for debugging
    console.error("Error uploading file:", error);

    // Return a JSON response with an error message if the upload fails
    return json({ error: error.message || "Upload failed" }, { status: 500 });
  }
};
