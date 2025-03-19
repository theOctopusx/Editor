import { YooptaPlugin } from "@yoopta/editor";
import { SeparatorHorizontal } from "lucide-react";
import { PageRenderElement } from "./renders/Page";

const PagePlugin = new YooptaPlugin({
  type: "Page",
  elements: {
    page: {
      render: PageRenderElement,
      props: {
        title: "New Page",
        pageId: null,
        nodeType: "void",
      },
    },
  },
  options: {
    shortcuts: ["/page"],
    display: {
      title: "New Page",
      description: "Insert a new page block",
      icon: <SeparatorHorizontal />,
    },
  },
});

export { PagePlugin };
