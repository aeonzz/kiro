import { SlateElement, type SlateElementProps } from "platejs/static";

export function BlockquoteElementStatic(props: SlateElementProps) {
  return (
    <SlateElement
      as="blockquote"
      className="my-2 border-l-2 pl-6 italic"
      {...props}
    />
  );
}
