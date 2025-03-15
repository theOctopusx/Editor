export const CLOUDINARY = {
    PRESET: "ml_default",
    API: "https://api.cloudinary.com/v1_1/do0sqsghp",
    CLOUD_NAME: "do0sqsghp",
  };
  
  export type MediaObject = {
    secure_url: string;
    url: string;
    height: number;
    width: number;
    asset_id: string;
    format: string;
    public_id: string;
    version_id: string;
    name: string;
    bytes: number;
  };
  
  export type ImageObject = MediaObject;
  export type VideoObject = MediaObject;
  
  export const uploadToCloudinary = async (file: File, type = 'image'): Promise<MediaObject> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY.PRESET);
  
    try {
      const call = await fetch(`${CLOUDINARY.API}/${type}/upload`, { method: 'POST', body: formData });
      const response = await call.json();
      console.log(response);
  
      return {
        secure_url: response.secure_url,
        width: response.width,
        height: response.height,
        url: response.url,
        asset_id: response.asset_id,
        format: response.format,
        public_id: response.public_id,
        version_id: response.version_id,
        name: response.original_filename,
        bytes: response.bytes,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };