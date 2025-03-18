import { useParams, useLoaderData } from "@remix-run/react";
import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  generateId,
} from "@yoopta/editor";
import { useEffect, useMemo, useRef, useState } from "react";
import { MARKS } from "~/components/Editor/marks";
import { plugins } from "~/components/Editor/plugin";
import { TOOLS } from "~/components/Editor/tools";
import { Input } from "~/components/ui/input";
import { loader } from "~/routes/content";

const NotionLikePageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useLoaderData<typeof loader>();

  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState<string>(data?.title || "Untitled");
  const [value, setValue] = useState<YooptaContentValue>(data?.content || {});
  const [editorId, setEditorId] = useState<string>(generateId());
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const useDebounce = (input: string, delay: number): string => {
    const [debouncedValue, setDebouncedValue] = useState<string>(input);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(input), delay);
      return () => clearTimeout(handler);
    }, [input, delay]);
    return debouncedValue;
  };

  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (data) {
      setEditorId(generateId());
      setValue(data.content);
      setTitle(data.title);
    }
  }, [id, data]);

  useEffect(() => {
    if (debouncedTitle && debouncedTitle !== data?.title) {
      saveEditorData(debouncedTitle, value);
    }
  }, [debouncedTitle, data?.title, value]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = async (newValue: YooptaContentValue) => {
    setValue(newValue);
    await saveEditorData(title, newValue);
  };

  const saveEditorData = async (updatedTitle: string, updatedContent: YooptaContentValue) => {
    setIsSaving(true);
    try {
      await fetch("/api/save-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: id,
          title: updatedTitle,
          content: updatedContent,
        }),
      });
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="md:py-[100px] border md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex flex-col justify-center"
      ref={selectionRef}
    >
      <Input
        value={title}
        onChange={handleTitleChange}
        className="border-none text-3xl font-bold px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Untitled"
      />
      {data ? (
        <YooptaEditor
          key={editorId}
          width={672}
          editor={editor}
          plugins={plugins}
          tools={TOOLS}
          marks={MARKS}
          selectionBoxRoot={selectionRef}
          value={value}
          onChange={handleContentChange}
        //   autoFocus
        />
      ) : (
        <p>Loading...</p>
      )}
      {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
    </div>
  );
};

export default NotionLikePageEditor;
