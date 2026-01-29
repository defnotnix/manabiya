import { createTheme, MantineTheme } from "@mantine/core";

import { configThemeMantineMain } from "./theme.mantine.main";
import { configThemeMantineComponents } from "./theme.mantine.components";

export const configThemeMantine: any = createTheme({
  ...configThemeMantineMain,
  components: configThemeMantineComponents,
});
