import { cva } from "class-variance-authority";

export const toggleVariants = cva("relative py-2 pl-6", {
  variants: {
    heading: {
      h1: "font-bold text-2xl",
      h2: "font-semibold text-xl",
      h3: "font-semibold text-lg",
    },
  },
});
