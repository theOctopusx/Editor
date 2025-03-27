import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image, { ImageUploadResponse } from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import { uploadToCloudinary } from '~/utils/cloudinary';
import { PagePlugin } from '../withCustomPlugin/customPlugins/Page';
import { uploadToR2 } from '~/utils/r2Upload';


export const plugins = [
  Paragraph,
  PagePlugin,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  BulletedList,
  NumberedList,
  TodoList,
  Accordion,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: '#007aff',
      }),
    },
  }),
  Callout,
  Blockquote,
  Table,
  Image.extend({
    options: {
      async onUpload(file): Promise<ImageUploadResponse> {
        if (!file) {
          console.error("No file received");
          return null;
        }
  
        console.log("Uploading file:", file); // Check if file is received
  
        try {
          // Create a FormData object and append the file.
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type",'image')
  
          // Send the form data to your API endpoint.
          const response = await fetch("/api/r2upload", {
            method: "POST",
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
          }
  
          const data = await response.json();
          console.log("Upload response:", data); // Check response
  
          return {
            src: data.secure_url,
            alt: "r2",
            sizes: {
              width: data.width,
              height: data.height,
            },
          };
        } catch (error) {
          console.error("Image upload failed:", error); // Log upload error
          return null;
        }
      },
    },
  }),
  Video.extend({
    options: {
      onUpload: async (file) => {
        const data = await uploadToCloudinary(file, 'video');
        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
      onUploadPoster: async (file) => {
        const image = await uploadToCloudinary(file, 'image');
        return image.secure_url;
      },
    },
    // options: {
    //   async onUpload(file) {
    //     if (!file) {
    //       console.error("No file received");
    //       return null;
    //     }
  
    //     console.log("Uploading video:", file);
  
    //     try {
    //       // Create a FormData object and append the file.
    //       const formData = new FormData();
    //       formData.append("file", file);
    //       formData.append("type", "video");
  
    //       // Send the form data to your API endpoint.
    //       const response = await fetch("/api/r2upload", {
    //         method: "POST",
    //         body: formData,
    //       });
  
    //       if (!response.ok) {
    //         throw new Error(`Upload failed with status ${response.status}`);
    //       }
  
    //       const data = await response.json();
    //       console.log("Upload response:", data);
  
    //       return {
    //         src: data.secure_url,
    //         alt: "r2 video",
    //         sizes: {
    //           width: data.width,
    //           height: data.height,
    //         },
    //       };
    //     } catch (error) {
    //       console.error("Video upload failed:", error);
    //       return null;
    //     }
    //   },
    //   async onUploadPoster(file){
    //     if (!file) {
    //       console.error("No poster file received");
    //       return null;
    //     }
  
    //     console.log("Uploading poster:", file);
  
    //     try {
    //       // Create FormData for poster image.
    //       const formData = new FormData();
    //       formData.append("file", file);
    //       formData.append("type", "image");
  
    //       const response = await fetch("/api/r2upload", {
    //         method: "POST",
    //         body: formData,
    //       });
  
    //       if (!response.ok) {
    //         throw new Error(`Poster upload failed with status ${response.status}`);
    //       }
  
    //       const data = await response.json();
    //       console.log("Poster upload response:", data);
  
    //       return data.secure_url;
    //     } catch (error) {
    //       console.error("Poster upload failed:", error);
    //       return null;
    //     }
    //   },
    // },
  }),
  File.extend({
    options: {
      onUpload: async (file) => {
        const response = await uploadToCloudinary(file, 'auto');
        return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
      },
    },
  }),
  Embed,
  Code,
  Link,
  // ButtonPlugin,
  ];