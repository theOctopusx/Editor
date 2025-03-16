import { useParams, useLoaderData } from "@remix-run/react";
import YooptaEditor, { createYooptaEditor, YooptaContentValue } from "@yoopta/editor";
import { useEffect, useMemo, useRef, useState } from "react";
import { MARKS } from "~/components/Editor/marks";
import { plugins } from "~/components/Editor/plugin";
import { TOOLS } from "~/components/Editor/tools";
import { Input } from "~/components/ui/input";
import { loader } from "~/routes/content";

const NotionLikePageEditor = () => {
    const { id } = useParams();
    const {data} = useLoaderData<typeof loader>(); // Load content from server

    const editor = useMemo(() => createYooptaEditor(), [id]);
    const selectionRef = useRef(null);

    const [title, setTitle] = useState(data?.title || "Untitled");
    const [value, setValue] = useState<YooptaContentValue>(data?.content);

    useEffect(() => {
        if (data) {
            setTitle(data.title || title);
            setValue(data.content || value);
        }
    }, [id, data]);

    const handleTitleChange = async (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        await saveEditorData(newTitle, value);
    };

    const handleContentChange = async (newValue: YooptaContentValue) => {
        setValue(newValue);
        // const editorContent = editor.getEditorValue();
        await saveEditorData(title, newValue);
    };

    const saveEditorData = async (title: string, content: YooptaContentValue) => {
        try {
            await fetch(`/api/save-editor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, contentId: id, title }),
            });
        } catch (error) {
            console.error("Error saving content:", error);
        }
    };

    return (
        <div className="md:py-[100px] border md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex flex-col justify-center"
             ref={selectionRef}>
            <Input
                value={title}
                onChange={handleTitleChange}
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
                onChange={handleContentChange}
                autoFocus
            />
        </div>
    );
};

export default NotionLikePageEditor;
