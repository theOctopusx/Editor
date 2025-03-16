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
    const { data } = useLoaderData<typeof loader>(); // Fetch content from server

    const editor = useMemo(() => createYooptaEditor(), [id]);
    const selectionRef = useRef(null);

    const [title, setTitle] = useState(data?.title || "Untitled");
    const [value, setValue] = useState<YooptaContentValue>(data?.content || {});
    const [isSaving, setIsSaving] = useState(false);

    // Debounce function to delay API calls while typing
    function useDebounce(value: string, delay: number) {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(handler);
        }, [value, delay]);
        return debouncedValue;
    }

    const debouncedTitle = useDebounce(title, 500);

    useEffect(() => {
        if (data) {
            setTitle(data.title || "Untitled");
            setValue(data.content || {});
        }
    }, [id, data]);

    useEffect(() => {
        if (debouncedTitle && debouncedTitle !== data?.title) {
            saveEditorData(debouncedTitle, value);
        }
    }, [debouncedTitle]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = async (newValue: YooptaContentValue) => {
        setValue(newValue);
        await saveEditorData(title, newValue);
    };

    const saveEditorData = async (updatedTitle: string, updatedContent: YooptaContentValue) => {
        setIsSaving(true);
        try {
            await fetch(`/api/save-editor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contentId: id, title: updatedTitle, content: updatedContent }),
            });
        } catch (error) {
            console.error("Error saving content:", error);
        } finally {
            setIsSaving(false);
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
            {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
        </div>
    );
};

export default NotionLikePageEditor;
