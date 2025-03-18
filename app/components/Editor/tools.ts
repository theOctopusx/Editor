import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { ActionNotionMenuExample } from './NotionExample/ActionNotionMenuExample';
import ActionMenuList from '@yoopta/action-menu-list';
import { NotionToolbar } from './NotionToolbar/NotionToolbar';
import Toolbar from '@yoopta/toolbar';

export const TOOLS = {
  ActionMenu: {
    render: ActionNotionMenuExample,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: NotionToolbar,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};