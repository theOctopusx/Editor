import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { ActionNotionMenuExample } from './NotionExample/ActionNotionMenuExample';
import ActionMenuList from '@yoopta/action-menu-list';
import Toolbar from '@yoopta/toolbar';
import { DefaultToolbarRender } from './toolbar/DefaultToolbarRender';





export const TOOLS = {
  ActionMenu: {
    render: ActionNotionMenuExample,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};