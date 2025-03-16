import { useParams } from "@remix-run/react";
import YooptaEditor, { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import { useMemo, useRef, useState } from "react";
import { MARKS } from "~/components/Editor/marks";
import { plugins } from "~/components/Editor/plugin";
import { TOOLS } from "~/components/Editor/tools";

const NotionLikePageEditor = ({data}) => {
    const {id} = useParams()
    const [value, setValue] = useState(data?.content);
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);
    const onChange = async (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
          setValue(newValue);
          console.log(newValue);
          try {
            const response = await fetch("/api/save-editor", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: newValue,contentId:id,title:'Untitled' }),
            });
        
            const dataResponse = await response.json();
            if (dataResponse.success) {
              console.log("Editor content saved successfully");
            } else {
              console.error("Failed to save content:", dataResponse.error);
            }
          } catch (error) {
            console.error("Error sending data:", error);
          }
        };
    
    return (
        <div
        className="md:py-[100px] border md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center"
        ref={selectionRef}>
        <YooptaEditor
        width={672}
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={value}
        onChange={onChange}
        autoFocus
        />
        </div>
    );
};

export default NotionLikePageEditor;