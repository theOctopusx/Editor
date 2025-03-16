import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import YooptaEditor, { createYooptaEditor } from "@yoopta/editor";
import { useEffect, useMemo, useRef, useState } from "react";
import { MARKS } from "~/components/Editor/marks";
import { plugins } from "~/components/Editor/plugin";
import { TOOLS } from "~/components/Editor/tools";
import { Input } from "~/components/ui/input";
import { EditorContent } from "~/module/editor/model";

export const loader: LoaderFunction = async ({params}) => {
    try {
      
      // Fetch all documents (modify as needed)
      const editorContents = await EditorContent.findOne({_id:params.id});
  
      return json({ success: true, data: editorContents });
    } catch (error) {
      console.error("Error fetching editor content:", error);
      return json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
  };
const PageContent = () => {
    const {id} = useParams()
    const {data } = useLoaderData<typeof loader>()
    const editor = useMemo(() => createYooptaEditor(), [id]);
    const selectionRef = useRef(null);
    const [title,setTitle] = useState(data?.title);
    const [value,setValue] = useState(data?.content);
  
    useEffect(() => {
  
            if (data?.content) {
                const editorContent = editor.getEditorValue();
                console.log(editorContent,'heeee');
                setTitle(data?.title);
                setValue(data?.content);
            }
        }, [id, data?.content,editor]);

    return (
        <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex flex-col justify-center"
      ref={selectionRef}
    >
      <Input
       value={title}
       className="border-none text-3xl font-bold px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
       placeholder="Untitled"
            />
            <YooptaEditor
                width={672}
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                value={value}
                selectionBoxRoot={selectionRef}
                readOnly
            />
    </div>
    );
};

export default PageContent;