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

  // Extract blocks from the editor content state.
  const blocks = Object.values(value);

  // Sort blocks based on the `order` property in meta
  blocks.sort((a, b) => a.meta.order - b.meta.order);

  // Utility function to extract text from a block's value array
  const extractText = (block) => {
    return block.value
      .map((item) => item.children.map((child) => child.text).join(""))
      .join(" ");
  };

  // Build the hierarchy for headings
  const hierarchy = [];
  let currentHeadingOne = null;
  let currentHeadingTwo = null;

  blocks.forEach((block) => {
    // Process only heading blocks
    if (block.type.startsWith("Heading")) {
      const headingText = extractText(block);
      const node = {
        type: block.type,
        text: headingText,
        children: [],
      };

      if (block.type === "HeadingOne") {
        hierarchy.push(node);
        currentHeadingOne = node;
        currentHeadingTwo = null;
      } else if (block.type === "HeadingTwo") {
        if (currentHeadingOne) {
          currentHeadingOne.children.push(node);
        } else {
          hierarchy.push(node);
        }
        currentHeadingTwo = node;
      } else if (block.type === "HeadingThree") {
        if (currentHeadingTwo) {
          currentHeadingTwo.children.push(node);
        } else if (currentHeadingOne) {
          currentHeadingOne.children.push(node);
        } else {
          hierarchy.push(node);
        }
      }
    }
  });

  // Recursive component to render the hierarchy
  const renderHierarchy = (nodes) => {
    return (
      <ul className="ml-4">
        {nodes.map((node, index) => (
          <li key={`${node.text}-${index}`} className="my-1">
            <span className="font-semibold">{node.text}</span>
            {node.children &&
              node.children.length > 0 &&
              renderHierarchy(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  console.log("Hierarchy:", JSON.stringify(hierarchy, null, 2));

  // Debounce hook for title changes
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

  const saveEditorData = async (
    updatedTitle: string,
    updatedContent: YooptaContentValue
  ) => {
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
    <div className="flex md:py-[100px] px-[20px] pt-[80px] pb-[40px]">
      {/* Sidebar Summary */}
      <aside className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Document Summary</h2>
        {hierarchy.length > 0 ? (
          renderHierarchy(hierarchy)
        ) : (
          <p className="text-sm text-gray-500">No headings available.</p>
        )}
      </aside>

      {/* Editor Area */}
      <div className="flex-1 pl-4" ref={selectionRef}>
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
          />
        ) : (
          <p>Loading...</p>
        )}
        {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
      </div>
    </div>
  );
};

export default NotionLikePageEditor;
