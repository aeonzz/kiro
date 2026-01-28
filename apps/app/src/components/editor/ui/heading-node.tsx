import { cva, type VariantProps } from "class-variance-authority";
import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";

const headingVariants = cva("relative", {
  variants: {
    variant: {
      h1: "not-first:mt-8 mb-4 font-bold text-2xl",
      h2: "not-first:mt-8 mb-4 font-semibold text-xl",
      h3: "not-first:mt-6 mb-1.5 font-semibold text-lg",
    },
  },
});

export function HeadingElement({
  variant = "h1",
  ...props
}: PlateElementProps & VariantProps<typeof headingVariants>) {
  return (
    <PlateElement
      as={variant!}
      className={headingVariants({ variant })}
      {...props}
    >
      {props.children}
    </PlateElement>
  );
}

export function H1Element(props: PlateElementProps) {
  return <HeadingElement variant="h1" {...props} />;
}

export function H2Element(props: PlateElementProps) {
  return <HeadingElement variant="h2" {...props} />;
}

export function H3Element(props: PlateElementProps) {
  return <HeadingElement variant="h3" {...props} />;
}
