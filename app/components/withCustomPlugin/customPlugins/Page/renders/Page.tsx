import { PluginElementRenderProps } from "@yoopta/editor";
import { Link, useFetcher } from "@remix-run/react";
import { useState } from "react";

const PageRenderElement = ({
  element,
  attributes,
}: PluginElementRenderProps) => {
  const fetcher = useFetcher();

  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePage = () => {
    if (isCreating) return;
    setIsCreating(true);
    // Submit to your API route to create the page.
    fetcher.submit(
      {
        title: element.props.title || "Untitled Page",
        parentId: element.props.parentId || "",
      },
      { method: "post", action: "/api/new-page" }
    );
  };

  return (
    <div
      {...attributes}
      className="w-full flex relative items-center h-[20px] my-1"
      contentEditable={false}
    >
      {element.props.pageId ? (
        <Link
          to={`/dashboard/content/${element.props.pageId}`}
          className="text-blue-500 hover:underline px-3 py-2 border-2 rounded-sm"
        >
          {element.props.title}
        </Link>
      ) : (
        <button
          onClick={handleCreatePage}
          disabled={isCreating}
          className="text-blue-500 hover:underline px-3 py-2 border-2 rounded-sm"
        >
          {isCreating ? "Creating page..." : "Create New Page"}
        </button>
      )}
    </div>
  );
};

export { PageRenderElement };
