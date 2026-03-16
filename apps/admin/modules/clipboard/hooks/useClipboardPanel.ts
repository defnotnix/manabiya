import { useState } from "react";

export const useClipboardPanel = () => {
  const [opened, setOpened] = useState(false);

  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const toggle = () => setOpened((o) => !o);

  return {
    opened,
    open,
    close,
    toggle,
  };
};
