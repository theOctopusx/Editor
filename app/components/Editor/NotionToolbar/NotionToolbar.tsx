import { ToolbarRenderProps } from '@yoopta/toolbar';
import { useYooptaEditor, useYooptaTools } from '@yoopta/editor';
import cx from 'classnames';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { useFloating, offset, flip, shift, inline, autoUpdate, FloatingPortal } from '@floating-ui/react';
import s from './NotionToolbar.module.scss';
import { buildActionMenuRenderProps } from '@yoopta/action-menu-list';
import CodeSvg from './icons/CodeSvg';
import UndoSvg from './icons/UndoSvg';
import RedoSvg from './icons/RedoSvg';
import BoldSvg from './icons/BoldSvg';
import ItalicSvg from './icons/ItalicSvg';
import UnderlineSvg from './icons/UnderlineSvg';
import StrikeSvg from './icons/StrikeSvg';
import TextAlignSvg from './icons/TextAlignSvg';

const DEFAULT_MODALS = { link: false, highlight: false, actionMenu: false };
type ModalsState = typeof DEFAULT_MODALS;

const NotionToolbar = (props: ToolbarRenderProps) => {
  const [modals, setModals] = useState<ModalsState>({ link: false, highlight: false, actionMenu: false });

  // positioning for action menu tool
  const { refs: actionMenuRefs, floatingStyles: actionMenuStyles } = useFloating({
    placement: 'bottom-start',
    open: modals.actionMenu,
    onOpenChange: (open) => onChangeModal('actionMenu', open),
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const onChangeModal = (modal: keyof ModalsState, value: boolean) => {
    setModals(() => ({ ...DEFAULT_MODALS, [modal]: value }));
  };

  const { activeBlock } = props;
  const editor = useYooptaEditor();
  const tools = useYooptaTools();

  const blockLabel = activeBlock?.options?.display?.title || activeBlock?.type || '';
  const ActionMenu = tools.ActionMenu;

  const onCloseActionMenu = () => onChangeModal('actionMenu', false);

  const actionMenuRenderProps = buildActionMenuRenderProps({
    editor,
    onClose: onCloseActionMenu,
    view: 'small',
    mode: 'toggle',
  });

  return (
    <div className='font-sans'>
      <div className={s.toolbar}>
        <div className={s.group}>

        </div>
        <div className={s.group}>
          <button
            type="button"
            className={s.item}
            ref={actionMenuRefs.setReference}
            onClick={() => onChangeModal('actionMenu', !modals.actionMenu)}
          >
            <span className={s.block}>
              {blockLabel} <ChevronDownIcon size={12} strokeWidth={2} />
            </span>
            {modals.actionMenu && !!ActionMenu && (
              <FloatingPortal id="yoo-custom-toolbar-action-menu-list-portal" root={editor.refElement}>
                <button style={actionMenuStyles} ref={actionMenuRefs.setFloating} onClick={(e) => e.stopPropagation()}>
                  <ActionMenu {...actionMenuRenderProps} />
                </button>
              </FloatingPortal>
            )}
          </button>
        </div>
        {/* this is for bold/italic/underline */}
        <div className={s.group}>
          {/* this is for undo/redo */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                editor.redo({ scroll: false });
              }}
              className="p-2 text-xs shadow-md border-r hover:bg-[rgba(0,0,0,0.05)] hover:text-[#fff] disabled:opacity-50"
              disabled={editor.historyStack.redos.length === 0}
            >
              <RedoSvg />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.undo({ scroll: false });
              }}
              className="p-2 text-xs shadow-md hover:bg-[rgba(0,0,0,0.05)] hover:text-[#fff] disabled:opacity-50"
              disabled={editor.historyStack.undos.length === 0}
            >
              <UndoSvg />
            </button>
          </div>
          <button
            type="button"
            onClick={() => editor.formats.bold.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.bold.isActive() })}
          >
            <span className={s.bold}>
              <BoldSvg />
            </span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.italic.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.italic.isActive() })}
          >
            <span className={s.italic}>
              <ItalicSvg />
            </span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.underline.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.underline.isActive() })}
          >
            <span className={s.underline}>
              <UnderlineSvg />
            </span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.strike.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.strike.isActive() })}
          >
            <span className={s.bold}>
              <StrikeSvg />
            </span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.code.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.code.isActive() })}
          >
            <span className={s.code}>
              <CodeSvg />
            </span>
          </button>
        </div>
        <div className='s.group'>
          <button
            type="button"
            onClick={() => editor.formats.align.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.code.isActive() })}
          >
            <span className={s.code}>
              <TextAlignSvg />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { NotionToolbar };
