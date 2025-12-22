import {
  fontSizes,
  FontSizeValue,
  homeViewOptions,
  HomeViewValue,
} from "@/config/preferences";

export type HomeViewOptions = {
  value: HomeViewValue;
  label: string;
};

export type FontSizeOptions = {
  value: FontSizeValue;
  label: string;
};

export type FontSize = (typeof fontSizes)[number];
export type HomeView = (typeof homeViewOptions)[number];
