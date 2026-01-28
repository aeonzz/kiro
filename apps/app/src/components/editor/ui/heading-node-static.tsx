import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { SlateElementProps } from "platejs/static";
import { SlateElement } from "platejs/static";

const headingVariants = cva("relative", {
  variants: {
    variant: {
      h1: "not-first:mt-8 mb-4 font-bold text-2xl",
      h2: "not-first:mt-8 mb-4 font-semibold text-xl",
      h3: "not-first:mt-6 mb-1.5 font-semibold text-lg",
    },
  },
});

export function HeadingElementStatic({
  variant = "h1",
  ...props
}: SlateElementProps & VariantProps<typeof headingVariants>) {
  const id = props.element.id as string | undefined;

  return (
    <SlateElement
      as={variant!}
      className={headingVariants({ variant })}
      {...props}
    >
      {/* Bookmark anchor for DOCX TOC internal links */}
      {id && <span id={id} />}
      {props.children}
    </SlateElement>
  );
}

export function H1ElementStatic(props: SlateElementProps) {
  return <HeadingElementStatic variant="h1" {...props} />;
}

export function H2ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>
) {
  return <HeadingElementStatic variant="h2" {...props} />;
}

export function H3ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>
) {
  return <HeadingElementStatic variant="h3" {...props} />;
}
