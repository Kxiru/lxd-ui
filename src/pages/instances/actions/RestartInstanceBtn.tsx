import { FC, useState } from "react";
import type { LxdInstance } from "types/instance";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { restartInstance } from "api/instances";
import { useInstanceLoading } from "context/instanceLoading";
import ConfirmationForce from "components/ConfirmationForce";
import { ConfirmationButton, Icon } from "@canonical/react-components";
import { useEventQueue } from "context/eventQueue";
import { useToastNotification } from "context/toastNotificationProvider";
import ItemName from "components/ItemName";
import InstanceLinkChip from "../InstanceLinkChip";

interface Props {
  instance: LxdInstance;
}

const RestartInstanceBtn: FC<Props> = ({ instance }) => {
  const eventQueue = useEventQueue();
  const instanceLoading = useInstanceLoading();
  const toastNotify = useToastNotification();
  const [isForce, setForce] = useState(false);
  const queryClient = useQueryClient();
  const isLoading =
    instanceLoading.getType(instance) === "Restarting" ||
    instance.status === "Restarting";

  const instanceLink = <InstanceLinkChip instance={instance} />;

  const handleRestart = () => {
    instanceLoading.setLoading(instance, "Restarting");
    void restartInstance(instance, isForce)
      .then((operation) => {
        eventQueue.set(
          operation.metadata.id,
          () => toastNotify.success(<>Instance {instanceLink} restarted.</>),
          (msg) =>
            toastNotify.failure(
              "Instance restart failed",
              new Error(msg),
              instanceLink,
            ),
          () => {
            instanceLoading.setFinish(instance);
            void queryClient.invalidateQueries({
              queryKey: [queryKeys.instances],
            });
          },
        );
      })
      .catch((e) => {
        toastNotify.failure("Instance restart failed", e, instanceLink);
        instanceLoading.setFinish(instance);
      });
  };

  const disabledStatuses = ["Stopped", "Frozen", "Error"];
  const isDisabled =
    isLoading ||
    disabledStatuses.includes(instance.status) ||
    instanceLoading.getType(instance) === "Migrating";

  return (
    <ConfirmationButton
      appearance="base"
      loading={isLoading}
      className="has-icon is-dense"
      confirmationModalProps={{
        title: "Confirm restart",
        children: (
          <p>
            This will restart instance <ItemName item={instance} bold />.
          </p>
        ),
        onConfirm: handleRestart,
        close: () => setForce(false),
        confirmButtonLabel: "Restart",
        confirmExtra: (
          <ConfirmationForce
            label="Force restart"
            force={[isForce, setForce]}
          />
        ),
      }}
      disabled={isDisabled}
      shiftClickEnabled
      showShiftClickHint
    >
      <Icon name="restart" />
    </ConfirmationButton>
  );
};

export default RestartInstanceBtn;
