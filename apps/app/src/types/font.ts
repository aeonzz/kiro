export enum FontSizeValue {
  XS = "xs",
  SM = "sm",
  DEFAULT = "default",
  LG = "lg",
  XL = "xl",
}

export const fontSizes = [
  { label: "Smaller", value: FontSizeValue.XS },
  { label: "Small", value: FontSizeValue.SM },
  { label: "Default", value: FontSizeValue.DEFAULT },
  { label: "Large", value: FontSizeValue.LG },
  { label: "Larger", value: FontSizeValue.XL },
];

export type FontSize = (typeof fontSizes)[number];
