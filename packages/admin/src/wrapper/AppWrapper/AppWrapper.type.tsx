import { MantineTheme } from "@mantine/core";
import { ReactNode } from "react";

export type PropAppWrapper = {
  children: ReactNode;
  extraHeadTags?: ReactNode;
  title?: string;

  theme?: MantineTheme;
  defaultColorScheme?: "light" | "dark" | "auto";

  classNames?: any;
};
