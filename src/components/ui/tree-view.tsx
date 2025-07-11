"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";

import {
  ChevronRight,
  File,
  FolderClosed,
  FolderOpen,
  type LucideProps,
} from "lucide-react";
import { createContext, useContext, useState } from "react";
import type {
  Ref,
  DragEvent,
  ReactNode,
  ComponentPropsWithRef,
  HTMLAttributes,
  PropsWithChildren,
} from "react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

type Primitive = string | number | boolean | null | undefined | symbol | bigint;


interface TreeDataItem {
  id: string;
  name: string | ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  rawData?: string;
  renderOpenIcon?: (props: LucideProps) => ReactNode;
  renderSelectedIcon?: (props: LucideProps) => ReactNode;
  children?: TreeDataItem[];
  draggable?: boolean;
  droppable?: boolean;
  onClick?: () => void;
}

const TreeContext = createContext<{
  data: TreeDataItem[] | TreeDataItem;
  expandedItemIds: string[];
  handleDragStart: (item: TreeDataItem) => void;
  handleSelectChange: (item?: TreeDataItem) => void;
  draggedItem: TreeDataItem | null;
  selectedItemId?: string;
} | null>(null);

function useTree() {
  return useContext(TreeContext)!;
}

export interface TreeProps extends PropsWithChildren {
  data: TreeDataItem[] | TreeDataItem;
  expandAll?: boolean;
  className?: string;
  initialSelectedItemId?: string;
  onSelectChange?: (item?: TreeDataItem) => void;
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void;
}

function TreeView({
  data,
  initialSelectedItemId,
  onSelectChange,
  className,
  onDocumentDrag,
  children,
  expandAll = false,
}: TreeProps) {
  const [selectedItemId, setSelectedItemId] = useState(initialSelectedItemId);
  const [draggedItem, setDraggedItem] = useState<TreeDataItem | null>(null);

  function handleSelectChange(item?: TreeDataItem) {
    setSelectedItemId(item?.id);

    if (onSelectChange) {
      onSelectChange(item);
    }
  }

  function handleDragStart(item: TreeDataItem) {
    setDraggedItem(item);
  }

  function handleDrop(targetItem: TreeDataItem) {
    if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
      onDocumentDrag(draggedItem, targetItem);
    }

    setDraggedItem(null);
  }

  const expandedItemIds = (() => {
    if (!initialSelectedItemId) {
      return [];
    }

    const ids: string[] = [];

    function walkTreeItems(
      data: TreeDataItem[] | TreeDataItem,
      initialSelectedItemId: string,
    ) {
      if (Array.isArray(data)) {
        for (const item of data) {
          ids.push(item.id);
          if (walkTreeItems(item, initialSelectedItemId) && !expandAll) {
            return true;
          }

          if (!expandAll) ids.pop();
        }
      } else if (!expandAll && data.id === initialSelectedItemId) {
        return true;
      } else if (data.children) {
        return walkTreeItems(data.children, initialSelectedItemId);
      }
    }

    walkTreeItems(data, initialSelectedItemId);
    return ids;
  })();

  return (
    <div className={cn("relative overflow-hidden p-2", className)}>
      <TreeContext
        value={{
          data,
          selectedItemId,
          expandedItemIds,
          handleDragStart,
          handleSelectChange,
          draggedItem,
        }}
      >
        {children}
      </TreeContext>

      <div
        className="h-12 w-full"
        onDrop={() => handleDrop({ id: "", name: "parent_div" })}
      />
    </div>
  );
}

interface TreeItemProps {
  renderNodeIcon?: (props: LucideProps) => ReactNode;
  renderLeafIcon?: (props: LucideProps) => ReactNode;
  ref?: Ref<HTMLUListElement>;
  data?: TreeDataItem | TreeDataItem[];
  handleDrop?: (item: TreeDataItem) => void;
  showRaw?: boolean
}

function TreeItem({
  ref,
  showRaw,
  renderNodeIcon = (props) => <FolderClosed {...props} />,
  renderLeafIcon = (props) => <File {...props} />,
  handleDrop,
  data,
  ...props
}: TreeItemProps) {
  const { data: item } = useTree();

  if (!data) {
    data = item;
  }

  const arrayData = Array.isArray(data) ? data : [data];

  return (
    <ul ref={ref} role="tree" {...props}>
      {arrayData.map((item) => {
        return (
          <li key={item.id}>
            {showRaw && (
              <TreeLeaf
                item={{
                  id: item.id,
                  name: item.rawData,
                  onClick: () =>
                    navigator.clipboard.writeText(item.rawData ?? ""),
                }}
                renderLeafIcon={renderLeafIcon}
                handleDrop={handleDrop}
              />
            )}
            {!showRaw &&
              (item.children ? (
                <TreeNode
                  item={item}
                  renderNodeIcon={renderNodeIcon}
                  renderLeafIcon={renderLeafIcon}
                  handleDrop={handleDrop}
                />
              ) : (
                <TreeLeaf
                  item={item}
                  renderLeafIcon={renderLeafIcon}
                  handleDrop={handleDrop}
                />
              ))}
          </li>
        );
      })}
    </ul>
  );
}

interface TreeNodeProps
  extends Required<Pick<TreeItemProps, "renderLeafIcon" | "renderNodeIcon">> {
  item: TreeDataItem;
  handleDrop?: (item: TreeDataItem) => void;
}

function TreeNode({
  item,
  renderNodeIcon,
  renderLeafIcon,
  handleDrop,
}: TreeNodeProps) {
  const {
    selectedItemId,
    handleSelectChange,
    handleDragStart,
    expandedItemIds,
    draggedItem,
  } = useTree();
  const [value, setValue] = useState(
    expandedItemIds.includes(item.id) ? [item.id] : [],
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  function onDragStart(e: DragEvent) {
    if (!item.draggable) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("text/plain", item.id);
    handleDragStart(item);
  }

  function onDragOver(e: DragEvent) {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault();
      setIsDragOver(true);
    }
  }

  function onDragLeave() {
    setIsDragOver(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    handleDrop?.(item);
  }

  const isOpen = value.includes(item.id);

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={(s) => setValue(s)}
    >
      <AccordionPrimitive.Item value={item.id}>
        <AccordionPrimitive.Header>
          <AccordionPrimitive.Trigger
            className={cn(
              "before:bg-accent/70 group flex w-full flex-1 items-center px-2 py-2 transition-all before:absolute before:left-0 before:-z-10 before:h-[2rem] before:w-full before:rounded-lg before:opacity-0 hover:before:opacity-100",
              selectedItemId === item.id &&
                "before:bg-accent/70 text-accent-foreground before:opacity-100",
              isDragOver &&
                "before:bg-primary/20 text-primary-foreground before:opacity-100",
            )}
            onClick={() => {
              handleSelectChange(item);
              item.onClick?.();
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onDragLeave={onDragLeave}
            draggable={!!item.draggable}
          >
            <ChevronRight
              className={cn(
                "text-accent-foreground/50 mr-1 size-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-90",
              )}
            />

            <TreeIcon
              item={item}
              isSelected={selectedItemId === item.id}
              isOpen={isOpen}
              default={renderNodeIcon}
            />

            <div className="flex gap-2 items-center">
              <span className="truncate text-sm">{item.name}</span>
              {item.children?.some((item) => !!item.rawData) && (
                <Button
                  size="link"
                  variant="link"
                  className={cn("text-orange-400 text-sm", showRaw && "text-blue-400")}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowRaw(!showRaw);
                  }}
                >
                  {showRaw ? "Show parsed" : "Show raw"}
                </Button>
              )}
            </div>

            <TreeActions isSelected={selectedItemId === item.id}>
              {item.actions}
            </TreeActions>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        <AccordionContent className="ml-4 border-l pl-1">
          <TreeItem
            showRaw={showRaw}
            data={item.children ? item.children : item}
            handleDrop={handleDrop}
            renderLeafIcon={renderLeafIcon}
            renderNodeIcon={renderNodeIcon}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
}

interface TreeLeafProps
  extends HTMLAttributes<HTMLDivElement>,
    Required<Pick<TreeItemProps, "renderLeafIcon">> {
  item: TreeDataItem;
  selectedItemId?: string;
  handleDragStart?: (item: TreeDataItem) => void;
  handleDrop?: (item: TreeDataItem) => void;
  ref?: Ref<HTMLDivElement>;
}

function TreeLeaf({
  ref,
  className,
  item,
  renderLeafIcon,
  handleDrop,
  ...props
}: TreeLeafProps) {
  const { selectedItemId, handleSelectChange, handleDragStart, draggedItem } =
    useTree();
  const [isDragOver, setIsDragOver] = useState(false);

  function onDragStart(e: DragEvent) {
    if (!item.draggable) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("text/plain", item.id);
    handleDragStart(item);
  }

  function onDragOver(e: DragEvent) {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault();
      setIsDragOver(true);
    }
  }

  function onDragLeave() {
    setIsDragOver(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    handleDrop?.(item);
  }

  return (
    <div
      ref={ref}
      className={cn(
        "before:bg-accent/70 group ml-5 flex cursor-pointer items-center px-2 py-2 text-left before:absolute before:left-0 before:right-1 before:-z-10 before:h-[2rem] before:w-full before:rounded-lg before:opacity-0 hover:before:opacity-100",
        selectedItemId === item.id &&
          "before:bg-accent/70 text-accent-foreground before:opacity-100",
        isDragOver &&
          "before:bg-primary/20 text-primary-foreground before:opacity-100",
        className,
      )}
      onClick={() => {
        handleSelectChange(item);
        item.onClick?.();
      }}
      draggable={!!item.draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      {...props}
    >
      <TreeIcon
        item={item}
        isSelected={selectedItemId === item.id}
        default={renderLeafIcon}
      />

      <span className="flex-grow text-sm">{item.name}</span>

      <TreeActions isSelected={selectedItemId === item.id}>
        {item.actions}
      </TreeActions>
    </div>
  );
}

function AccordionContent({
  ref,
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all",
        className,
      )}
      {...props}
    >
      <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
}

function TreeIcon({
  item,
  isOpen,
  isSelected,
  default: defaultIcon,
}: {
  item: TreeDataItem;
  isOpen?: boolean;
  isSelected?: boolean;
  default: (props: LucideProps) => ReactNode;
}) {
  const iconClassName = "mr-2 size-4 shrink-0";
  let Icon = defaultIcon({ className: iconClassName });

  item.renderOpenIcon ??= (props) => <FolderOpen {...props} />;

  if (isSelected && item.renderSelectedIcon) {
    Icon = item.renderSelectedIcon({ className: iconClassName });
  } else if (isOpen && item.children) {
    Icon = item.renderOpenIcon({ className: iconClassName });
  } else if (item.icon) {
    Icon = item.icon;
  }

  return Icon;
}

interface TreeActionsProps extends PropsWithChildren {
  isSelected: boolean;
}

function TreeActions({ children, isSelected }: TreeActionsProps) {
  return (
    <div
      className={cn(
        "absolute right-3 group-hover:block",
        isSelected ? "block" : "hidden",
      )}
    >
      {children}
    </div>
  );
}


function mapToTreeData(
  record: Record<string, Primitive | Record<string, Primitive>>,
): TreeDataItem[] {
  const treeData = Object.entries(record).map(([k, v]): TreeDataItem => {
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      return {
        id: k,
        name: k,
        children: mapToTreeData(v),
        rawData: addRawData(k,v)
      };
    }

    if (Array.isArray(v)) {
      const isPrimitiveArray = v.every(isPrimitive);

      if (isPrimitiveArray) {
        return {
          id: k,
          rawData: addRawData(k,v),
          name: (
            <div>
              {k}: [
              {v.map((item, i) => (
                <span key={i}>
                  <PrimitiveValue>{item as Primitive}</PrimitiveValue>
                  {i < v.length - 1 ? ", " : ""}
                </span>
              ))}
              ]
            </div>
          ),
        };
      }

      return {
        id: k,
        name: k,
        children: mapToTreeData(v),
        rawData: addRawData(k,v)
      };
    }

    return {
      id: k,
      name: (
        <div>
          {k}: <PrimitiveValue>{v}</PrimitiveValue>
        </div>
      ),
      rawData: addRawData(k,v)
    };
  });

  return treeData;
}

function addRawData(key: string, value: unknown) {
  try {
    const rawData = JSON.stringify({[key]: value}, null, 2)
    return rawData
  } catch (e) {
    return undefined
  }
}

function isPrimitive(value: unknown): value is Primitive {
  return value === null || (typeof value !== "object" && typeof value !== "function");
}

function PrimitiveValue({ children }: { children: Primitive }) {
  switch (true) {
    case typeof children === "string":
      return (
        <>
          &apos;
          <span className="text-blue-400">{children}</span>
          &apos;
        </>
      );

    case typeof children === "number":
      return <span className="text-orange-400">{children}</span>;

    case typeof children === "boolean":
      return <span className="text-purple-400">{children.toString()}</span>;

    case children === null:
      return <span className="text-gray-400">null</span>;

    default:
      return (
        <>
          &apos;
          <span className="text-gray-500" />
          &apos;
        </>
      );
  }
}


export { TreeView, TreeItem, mapToTreeData, type TreeDataItem, type Primitive };
