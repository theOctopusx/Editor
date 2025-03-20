/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useLoaderData } from "@remix-run/react";
import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  generateId,
} from "@yoopta/editor";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useMemo, useRef, useState } from "react";
import { generateHeadingHierarchy } from "~/components/Editor/editorFunction/generateHeadingHierarchy";
import { scrollToHeadingByText } from "~/components/Editor/editorFunction/scrollToHeadingByText";
import { MARKS } from "~/components/Editor/utils/marks";
import { plugins } from "~/components/Editor/utils/plugin";
import { TOOLS } from "~/components/Editor/utils/tools";
import { Input } from "~/components/ui/input";
import { usePageContext } from "~/hooks/use-dashboard";
import { loader } from "~/routes/content";

const NotionLikePageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useLoaderData<typeof loader>();

  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState<string>(data?.title || "Untitled");
  const [value, setValue] = useState<YooptaContentValue>(data?.content || {});
  console.log("value", value);
  const [editorId, setEditorId] = useState<string>(generateId());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);


  const hierarchy = generateHeadingHierarchy(value);

  // Function to scroll to a heading element by matching its text and occurrence index.
  

  // Recursive component to render the hierarchy with clickable headings.
  const renderHierarchy = (nodes: any[]) => {
    return (
      <ul className="ml-4">
        {nodes.map((node: { id: any; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; occurrenceIndex: any; children: string | any[]; }, index: any) => (
          <li key={`${node.id}-${index}`} className="my-1">
            <button
              className={`text-left hover:underline ${
                activeHeading === `${node.text}-${node.occurrenceIndex}`
                  ? "font-bold text-blue-600"
                  : "font-semibold"
              }`}
              onClick={() =>
                scrollToHeadingByText(node.text, node.occurrenceIndex,setActiveHeading)
              }
            >
              {node.text}
            </button>
            {node?.children &&
              node?.children.length > 0 &&
              renderHierarchy(node?.children)}
          </li>
        ))}
      </ul>
    );
  };


  useEffect(() => {
    if (data) {
      setEditorId(generateId());
      setValue(data.content);
      setTitle(data.title);
    }
  }, [id, data.content, data.title]);

  // * What this useEffect does is:
  // User types "Hello" → Timer starts (500ms countdown).
  // User types "Hello W" → Previous timer is cleared, new 500ms timer starts.
  // User stops typing → After 500ms, saveEditorData(value) is called.
  useEffect(() => {
    // * wait for 500ms
    const timeoutId = setTimeout(() => {
      saveEditorData(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [value, title]);

  const { updatePageTitle } = usePageContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updatePageTitle(id as string,e.target.value)
  };

  const handleContentChange = async (newValue: YooptaContentValue) => {
    setValue(newValue);
    await saveEditorData(newValue);
  };

  const saveEditorData = async (
    // updatedTitle: string,
    updatedContent: YooptaContentValue
  ) => {
    setIsSaving(true);
    try {
      await fetch("/api/save-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: id,
          title,
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
    <div className="flex gap-x-10 md:py-[100px] w-full px-[20px] pt-[80px] pb-[40px]">
      {/* Sidebar Summary */}
      <aside className="w-1/4 p-4 relative">
        <div className="sticky top-0">
          <h2 className="text-xl font-bold mb-4">Document Summary</h2>
          {hierarchy.length > 0 ? (
            renderHierarchy(hierarchy)
          ) : (
            <p className="text-sm text-gray-500">No headings available.</p>
          )}
        </div>
      </aside>

      {/* Editor Area */}
      <div className="flex-1 pl-4 border" ref={selectionRef}>
        {data ? (
          <>
            <Input
              value={title}
              onChange={handleTitleChange}
              className="border-none text-3xl font-bold px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Untitled"
            />
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
            />
          </>
        ) : (
          <p>Loading...</p>
        )}
        {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
      </div>
    </div>
  );
};

export default NotionLikePageEditor;
