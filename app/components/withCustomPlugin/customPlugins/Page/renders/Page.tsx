import { useEffect, useState } from "react";
import { Elements, PluginElementRenderProps, useYooptaEditor } from "@yoopta/editor";
import { Link, useFetcher } from "@remix-run/react";

const PageRenderElement = ({
  element,
  attributes,
  blockId
}: PluginElementRenderProps) => {
  const fetcher = useFetcher();
  const editor = useYooptaEditor();
  const [pageId,setPageId] = useState();
  console.log("PageRenderElement", element);
  // console.log("PageRenderEditor", editor.children);
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
      setPageId(fetcher?.data?.id)
      // console.log(newProps);
      const elementPath = Elements.getElementPath(editor, blockId, element);

      Elements.updateElement(
              editor,
              blockId,
              {type:'page',props: { ...element.props,pageId }},
              { path: elementPath },
        );

      // Update the element with the new props.
      // Transforms.setNodes(editor, { props: newProps }, { at: element.path });
    }
  }, [fetcher.data]);
  console.log(pageId,'Page Id');
  return (
    <div
      {...attributes}
      className="w-full flex relative items-center h-[20px] my-1"
      contentEditable={false}
    >
      {pageId ? (
        <Link
          to={`/dashboard/content/${pageId}`}
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
