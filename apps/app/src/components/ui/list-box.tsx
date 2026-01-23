import * as React from "react";
import { mergeProps, useRender } from "@base-ui/react";

import { cn } from "@/lib/utils";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";

interface ListBoxContextValue {
  activeIndex: number;
  getItemProps: (index: number) => any;
  onSelect?: (item: any) => void;
  items: any[];
}

const ListBoxContext = React.createContext<ListBoxContextValue | null>(null);

export function useListBox() {
  const context = React.useContext(ListBoxContext);
  if (!context) {
    throw new Error("useListBox must be used within a ListBox");
  }
  return context;
}

interface ListBoxProps<T> {
  items: T[];
  onSelect?: (item: T) => void;
  children: React.ReactNode;
  className?: string;
  loop?: boolean;
}

export function ListBox<T>({
  items,
  onSelect,
  children,
  className,
  loop = true,
}: ListBoxProps<T>) {
  const { activeIndex, getItemProps, getContainerProps } =
    useKeyboardNavigation({
      items,
      onSelect,
      loop,
    });

  return (
    <ListBoxContext.Provider
      value={{ activeIndex, getItemProps, onSelect, items }}
    >
      <div
        {...getContainerProps()}
        data-slot="list-box"
        className={cn("bg-background flex flex-col", className)}
      >
        {children}
      </div>
    </ListBoxContext.Provider>
  );
}

interface ListBoxItemProps extends useRender.ComponentProps<"div"> {
  index: number;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function ListBoxItem({
  index,
  className,
  onClick,
  render,
  isSelected,
  ...props
}: ListBoxItemProps) {
  const { getItemProps, onSelect, items } = useListBox();

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("group/list-box-item", className),
        //@ts-ignore
        "data-selected": isSelected || undefined,
        "aria-selected": isSelected,
        onClick: () => {
          onClick?.();
          onSelect?.(items[index]);
        },
      },
      props,
      getItemProps(index)
    ),
    render,
    state: {
      slot: "item",
      index,
      selected: isSelected,
    },
  });
}
