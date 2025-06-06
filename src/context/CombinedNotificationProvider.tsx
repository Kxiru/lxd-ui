import type { QueuedNotification } from "@canonical/react-components";
import {
  NotificationProvider,
  ToastNotificationProvider,
} from "@canonical/react-components";
import type { FC, PropsWithChildren } from "react";

const CombinedNotificationProvider: FC<
  PropsWithChildren<{ state: QueuedNotification["state"]; pathname?: string }>
> = ({ children, state, pathname }) => {
  return (
    <ToastNotificationProvider>
      <NotificationProvider state={state} pathname={pathname}>
        {children}
      </NotificationProvider>
    </ToastNotificationProvider>
  );
};

export default CombinedNotificationProvider;
