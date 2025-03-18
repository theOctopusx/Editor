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


export const plugins = [
  Paragraph,
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
          return file
        }

        console.log("Uploading file:", file); // Check if file is received

        try {
          const data = await uploadToCloudinary(file, 'image');
          console.log("Upload response:", data); // Check response

          return {
            src: data.secure_url,
            alt: 'cloudinary',
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