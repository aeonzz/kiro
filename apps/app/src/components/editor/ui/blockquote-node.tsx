import { PlateElement, type PlateElementProps } from "platejs/react";

export function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      as="blockquote"
      className="before:bg-border my-1 pl-4 italic before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-full before:content-['']"
      {...props}
    />
  );
}
