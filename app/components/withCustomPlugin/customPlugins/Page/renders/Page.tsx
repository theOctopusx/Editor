import { PluginElementRenderProps } from "@yoopta/editor";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

const PageRenderElement = ({
  element,
  attributes,
}: PluginElementRenderProps) => {
  const fetcher = useFetcher();
  const [pageData, setPageData] = useState({
    title: element.props.title,
    id: element.props.pageId,
  });

  useEffect(() => {
    if (!pageData.id) {
      fetcher.submit(
        { title: "Untitled Page", parentId: element.props.parentId },
        { method: "post", action: "/api/new-page" }
      );
    }
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setPageData({ title: fetcher.data.title, id: fetcher.data.id });
    }
  }, [fetcher.data]);

  return (
    <div
      {...attributes}
      className="w-full flex relative items-center h-[14px] my-1"
      contentEditable={false}
    >
      <Link
        to={`/pages/${pageData.id}`}
        className="text-blue-500 hover:underline"
      >
        {pageData.title}
      </Link>
    </div>
  );
};

export { PageRenderElement };
