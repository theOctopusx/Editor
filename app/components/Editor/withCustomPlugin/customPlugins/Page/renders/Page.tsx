import { useEffect } from "react";
import {
  Elements,
  PluginElementRenderProps,
  useYooptaEditor,
} from "@yoopta/editor";
import { Link, useFetcher, useParams } from "@remix-run/react";

const PageRenderElement = ({
  element,
  attributes,
  blockId,
}: PluginElementRenderProps) => {
  const fetcher = useFetcher();
  const editor = useYooptaEditor();
  console.log("content_id", element.id, "block_id", blockId);
  const { id } = useParams();

  // Listen for API responses via fetcher.
  useEffect(() => {
    const handleFetcherData = async () => {
      if (
        fetcher?.data?.id &&
        fetcher?.data?.title &&
        !element?.props?.pageId
      ) {
        const elementPath = Elements.getElementPath(editor, blockId, element);

        Elements.updateElement(
          editor,
          blockId,
          {
            type: "page",
            props: {
              ...element.props,
              title: fetcher?.data?.title,
              pageId: fetcher?.data?.id,
            },
          },
          { path: elementPath }
        );
      }
    };

    handleFetcherData();
  }, [fetcher?.data]);

  return (
    <div
      {...attributes}
      className="w-full flex relative items-center h-[20px] my-1"
      contentEditable={false}
    >
      {element?.props?.pageId ? (
        <Link
          to={`/dashboard/content/${element?.props?.pageId}`}
          className="text-blue-500 hover:underline px-3 py-2 border-2 rounded-sm"
        >
          {element.props.title}
        </Link>
      ) : (
        <fetcher.Form method="post" action="/api/createChildPage">
          <input type="hidden" name="parentId" value={id} />
          <input type="hidden" name="parentPageBlockId" value={blockId} />
          <input type="hidden" name="parentPageElementId" value={element.id} />
          <button
            type="submit"
            className="text-blue-500 hover:underline px-3 py-2 border-2 rounded-sm"
          >
            Create New Page
          </button>
        </fetcher.Form>
      )}
    </div>
  );
};

export { PageRenderElement };
