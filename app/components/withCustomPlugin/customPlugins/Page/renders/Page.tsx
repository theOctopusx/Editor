import { useEffect } from "react";
import {
  Elements,
  PluginElementRenderProps,
  useYooptaEditor,
} from "@yoopta/editor";
import { Form, Link, useActionData } from "@remix-run/react";

const PageRenderElement = ({
  element,
  attributes,
  blockId,
}: PluginElementRenderProps) => {
  const actionData = useActionData();
  const editor = useYooptaEditor();
  console.log("content_id", element.id,'block_id',blockId);

  // Listen for API responses via fetcher.
  useEffect(() => {
    const handleFetcherData = async () => {
      if (actionData?.id && actionData?.title && !element?.props?.pageId) {
        const elementPath = Elements.getElementPath(editor, blockId, element);

        Elements.updateElement(
          editor,
          blockId,
          {
            type: "page",
            props: {
              ...element.props,
              title: actionData?.title,
              pageId: actionData?.id,
            },
          },
          { path: elementPath }
        );
      }
    };

    handleFetcherData();
  }, [actionData]);

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
        <Form method="post">
          <button
            type="submit"
            className="text-blue-500 hover:underline px-3 py-2 border-2 rounded-sm"
          >
            Create New Page
          </button>
        </Form>
      )}
    </div>
  );
};

export { PageRenderElement };
