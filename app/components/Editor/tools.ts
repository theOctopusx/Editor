import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { ActionNotionMenuExample } from './NotionExample/ActionNotionMenuExample';
import ActionMenuList from '@yoopta/action-menu-list';
import { NotionToolbar } from './NotionToolbar/NotionToolbar';
import Toolbar from '@yoopta/toolbar';
import { DefaultToolbarRender } from '~/packages/tools/toolbar/src';

export const TOOLS = {
  ActionMenu: {
    render: ActionNotionMenuExample,
    tool: ActionMenuList,
  },
  Toolbar: {
    // render: NotionToolbar,
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};