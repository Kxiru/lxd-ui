import type { FC } from "react";
import { useState } from "react";
import ItemName from "components/ItemName";
import { postClusterMemberState } from "api/cluster";
import { queryKeys } from "util/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import type { LxdClusterMember } from "types/cluster";
import {
  ConfirmationButton,
  useNotify,
  useToastNotification,
} from "@canonical/react-components";
import ResourceLink from "components/ResourceLink";

interface Props {
  member: LxdClusterMember;
}

const EvacuateClusterMemberBtn: FC<Props> = ({ member }) => {
  const notify = useNotify();
  const toastNotify = useToastNotification();
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleEvacuate = () => {
    setLoading(true);
    postClusterMemberState(member, "evacuate")
      .then(() => {
        toastNotify.success(
          <>
            Cluster member{" "}
            <ResourceLink
              type="cluster-member"
              value={member.server_name}
              to="/ui/cluster"
            />{" "}
            evacuation started.
          </>,
        );
      })
      .catch((e) => notify.failure("Cluster member evacuation failed", e))
      .finally(() => {
        setLoading(false);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.cluster],
        });
      });
  };

  return (
    <ConfirmationButton
      appearance=""
      loading={isLoading}
      disabled={isLoading}
      confirmationModalProps={{
        title: "Confirm evacuation",
        children: (
          <p>
            This will evacuate cluster member{" "}
            <ItemName item={{ name: member.server_name }} bold />.
          </p>
        ),
        confirmButtonLabel: "Evacuate",
        onConfirm: handleEvacuate,
      }}
      shiftClickEnabled
      showShiftClickHint
    >
      <span>Evacuate</span>
    </ConfirmationButton>
  );
};

export default EvacuateClusterMemberBtn;
