import { useEffect, useState } from "react";
import {
  Elements,
  PluginElementRenderProps,
  useYooptaEditor,
} from "@yoopta/editor";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useNavigate,
} from "@remix-run/react";

const PageRenderElement = ({
  element,
  attributes,
  blockId,
}: PluginElementRenderProps) => {
  // const fetcher = useFetcher();
  // console.log(fetcher, "fetcther");
  const actionData = useActionData();
  const editor = useYooptaEditor();
  const navigate = useNavigate();
  console.log("PageRenderElement", element);
  // console.log("PageRenderEditor", editor.children);
  // console.log("PageRenderEditor", editor);

  // Listen for API responses via fetcher.
  useEffect(() => {
    const handleFetcherData = async () => {
      if (actionData?.id && actionData?.title) {
        const elementPath = Elements.getElementPath(editor, blockId, element);

        Elements.updateElement(
          editor,
          blockId,
          {
            type: "page",
            props: { ...element.props, pageId: actionData?.id },
          },
          { path: elementPath }
        );

        // * wait for a  second to allow the editor to update
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // if (element.props.pageId) {
        //   navigate(`/dashboard/content/${actionData?.id}`, { replace: true });
        // }
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
      {actionData ? (
        <Link
          to={`/dashboard/content/${actionData?.id}`}
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
