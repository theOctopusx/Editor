import { YooptaPlugin } from '@yoopta/editor';
import { SeparatorHorizontal } from 'lucide-react';
import { PageRenderElement } from './renders/Page';

const PagePlugin = new YooptaPlugin({
  type: 'Button',
  elements: {
    divider: {
      render: PageRenderElement,
      props: {
        nodeType: 'void',
      },
    },
  },
  options: {
    shortcuts: ['<--', '<---'],
    display: {
      title: 'New Page',
      description: 'Separate',
      icon: <SeparatorHorizontal />,
    },
  },
});

export { PagePlugin };
