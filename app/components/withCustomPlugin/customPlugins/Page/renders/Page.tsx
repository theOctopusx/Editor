import { PluginElementRenderProps } from '@yoopta/editor';

const PageRenderElement = ({ attributes, children }: PluginElementRenderProps) => {
  return (
    <div {...attributes} className="w-full flex relative items-center h-[14px] my-1" contentEditable={false}>
      New Page
    </div>
  );
};

export { PageRenderElement };
