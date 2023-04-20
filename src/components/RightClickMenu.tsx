import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { FC, ReactNode, useRef } from "react";
import { Portal } from "./Portal";
import { Icon, Icons } from "./Icons";

interface RightClickMenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
  isWiderScreen: boolean;
  handleRemoveMsg: () => Promise<void>;
  copyTextToClipboard: () => Promise<void>;
}

interface IMeuData {
  id: number;
  name: string;
  Icon: Icon;
}

const menuData: IMeuData[] = [
  {
    id: 1,
    name: "Copy",
    Icon: "CopyIcon",
  },
  {
    id: 2,
    name: "Delete",
    Icon: "DeleteIcon",
  },
];

const RightClickMenu: FC<RightClickMenuProps> = ({
  x,
  y,
  handleRemoveMsg,
  copyTextToClipboard,
  closeContextMenu,
  isWiderScreen,
}) => {
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(contextMenuRef, closeContextMenu);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const itemName = (e.target as HTMLElement).innerText;
    if (itemName === "Copy") {
      copyTextToClipboard();
    } else {
      handleRemoveMsg();
    }
  };

  let style = { top: `${y}px`, left: `${x}px` };
  if (isWiderScreen) {
    const menuWidth = 200;
    const screenWidth = window.innerWidth;
    const rightEdge = screenWidth - x;
    const distanceToRightEdge = rightEdge - menuWidth;

    if (distanceToRightEdge < 0) {
      style.left = `${x + distanceToRightEdge}px`;
    }
  }

  return (
    <Portal>
      <div
        ref={contextMenuRef}
        onClick={() => closeContextMenu()}
        className="absolute z-10 max-w-56 bg-gray-200 text-gray-90 flex flex-col flex-nowrap justify-start items-center"
        style={style}
      >
        <ul className="w-full rounded-lg border">
          {menuData.map((item) => {
            const Icon = Icons[item.Icon];
            return (
              <li
                onClick={handleClick}
                key={item.id}
                className=" flex items-center gap-2 justify-between border-b border-gray-300 px-8 py-2 hover:bg-slate-3000 cursor-pointer  hover:text-gray-200 hover:bg-indigo-600 "
              >
                <span className="w-full inline-block">{item.name}</span>
                <span>
                  <Icon className="h-4 w-4" />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Portal>
  );
};

export default RightClickMenu;
