import { useParams } from "@remix-run/react";
import YooptaEditor, { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import { useMemo, useRef, useState } from "react";
import { MARKS } from "~/components/Editor/marks";
import { plugins } from "~/components/Editor/plugin";
import { TOOLS } from "~/components/Editor/tools";
import { Input } from "~/components/ui/input";

const NotionLikePageEditor = ({data}) => {
    const {id} = useParams()
    const [value, setValue] = useState(data?.content);
    console.log(data);
    // useEffect(()=>{
    //     setValue(data?.content)
    // },[id])
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);
    const tileChange = async (title:string) => {
        try {
            const response = await fetch("/api/save-editor", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: value,contentId:id ,title:title}),
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
    }
    const onChange = async (newValue: YooptaContentValue) => {
          setValue(newValue);
          console.log(newValue);
          try {
            const response = await fetch("/api/save-editor", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: newValue,contentId:id ,title:"und"}),
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
        className="md:py-[100px] border md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex flex-col justify-center"
        ref={selectionRef}>
        <Input
        onChange={(e)=> tileChange(e.target.value)}
        defaultValue={data?.title}
          className="border-none text-3xl font-bold px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Untitled"
        />
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