import { useEffect } from "react";
import { PluginElementRenderProps, useYooptaEditor } from "@yoopta/editor";
import { Transforms } from "slate";
import { Link, useFetcher } from "@remix-run/react";

const PageRenderElement = ({
  element,
  attributes,
}: PluginElementRenderProps) => {
  const fetcher = useFetcher();
  const editor = useYooptaEditor();
  console.log("PageRenderElement", element);
  console.log("PageRenderEditor", editor.children);
  // console.log("PageRenderEditor", editor);

  // Listen for API responses via fetcher.
  useEffect(() => {
    if (fetcher.data && fetcher.data.id) {
      // Update the element props with the new page ID and title.
      const newProps = {
        ...element.props,
        pageId: fetcher.data.id, // Update the pageId with the new ID.
        title: fetcher.data.title, // Update the title with the new title.
      };

      // Update the element with the new props.
      Transforms.setNodes(editor, { props: newProps }, { at: element.path });
    }
  }, [fetcher.data, editor, element]);

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
          onClick={() => {
            // Trigger the API call to create the page.
            // This submits the form data, including parentId if available.
            fetcher.submit(
              {
                title: element.props.title,
              },
              { method: "post", action: "/api/new-page" }
            );
          }}
          className="text-blue-500 hover:underline px-3 py-2 border-2 rounded-sm"
        >
          {fetcher.state === "submitting"
            ? "Creating page..."
            : "Create New Page"}
        </button>
      )}
    </div>
  );
};

export { PageRenderElement };
