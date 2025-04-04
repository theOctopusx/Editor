import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo, useRef } from "react";
import { connectToDB } from "~/utils/db.server";
import YooptaEditor, {
    createYooptaEditor,
  } from '@yoopta/editor';
  
  import Paragraph from '@yoopta/paragraph';
  import Blockquote from '@yoopta/blockquote';
  import Embed from '@yoopta/embed';
  import Image from '@yoopta/image';
  import Link from '@yoopta/link';
  import Callout from '@yoopta/callout';
  import Video from '@yoopta/video';
  import File from '@yoopta/file';
  import Accordion from '@yoopta/accordion';
  import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
  import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
  import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
  import Code from '@yoopta/code';
  import Table from '@yoopta/table';
  import Divider from '@yoopta/divider';
  import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
  import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
  import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
  import { uploadToCloudinary } from "~/utils/cloudinary";
import { EditorContent } from "~/module/editor/model";
  
  const plugins = [
    Paragraph,
    Table,
    Divider.extend({
      elementProps: {
        divider: (props) => ({
          ...props,
          color: '#007aff',
        }),
      },
    }),
    Accordion,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    Callout,
    NumberedList,
    BulletedList,
    TodoList,
    Code,
    Link,
    Embed,
    Image.extend({
      options: {
        async onUpload(file) {
          const data = await uploadToCloudinary(file, 'image');
  
          return {
            src: data.secure_url,
            alt: 'cloudinary',
            sizes: {
              width: data.width,
              height: data.height,
            },
          };
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
  ];
  
  const TOOLS = {
    ActionMenu: {
      render: DefaultActionMenuRender,
      tool: ActionMenuList,
    },
    Toolbar: {
      render: DefaultToolbarRender,
      tool: Toolbar,
    },
    LinkTool: {
      render: DefaultLinkToolRender,
      tool: LinkTool,
    },
  };
  
  const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

export const loader: LoaderFunction = async () => {
    try {
      await connectToDB();
      
      // Fetch all documents (modify as needed)
      const editorContents = await EditorContent.find().sort({ createdAt: -1 });
  
      return json({ success: true, data: editorContents });
    } catch (error) {
      console.error("Error fetching editor content:", error);
      return json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
  };

const ContentPage = () => {
    const data  = useLoaderData()
    console.log(data.data[0]);
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);
  
    return (
        <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center"
      ref={selectionRef}
    >
      <YooptaEditor
        editor={editor}
        width={672}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={data?.data[0]?.content}
        readOnly
      />
    </div>
    );
};

export default ContentPage;