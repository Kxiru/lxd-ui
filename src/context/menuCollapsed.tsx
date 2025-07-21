import { useState } from "react";
import { isWidthBelow } from "util/helpers";
import {
  mediumScreenBreakpoint,
  smallScreenBreakpoint,
} from "./useIsScreenBelow";
import { useListener } from "@canonical/react-components";

const isSmallScreen = () => isWidthBelow(smallScreenBreakpoint);
const isMediumScreen = () => isWidthBelow(mediumScreenBreakpoint);

const noCollapseEvents = new Set(["search-and-filter"]);

export const useMenuCollapsed = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(isMediumScreen());

  const collapseOnMediumScreen = (e: Event | CustomEvent<string>) => {
    if (isSmallScreen()) {
      return;
    }
    if (!("detail" in e) || !noCollapseEvents.has(e.detail)) {
      setMenuCollapsed(isMediumScreen());
    }
  };

  useListener(window, collapseOnMediumScreen, "resize", true);

  const onSearchFilterPanelToggle = () => {
    if (!menuCollapsed && isSmallScreen()) {
      setMenuCollapsed(true);
    }
  };

  useListener(window, onSearchFilterPanelToggle, "sfp-toggle");

  return { menuCollapsed, setMenuCollapsed };
};
