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

const RestoreClusterMemberBtn: FC<Props> = ({ member }) => {
  const notify = useNotify();
  const toastNotify = useToastNotification();
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRestore = () => {
    setLoading(true);
    postClusterMemberState(member, "restore")
      .then(() => {
        toastNotify.success(
          <>
            Cluster member{" "}
            <ResourceLink
              to="/ui/cluster"
              type="cluster-member"
              value={member.server_name}
            />{" "}
            restore started.
          </>,
        );
      })
      .catch((e) => notify.failure("Cluster member restore failed", e))
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
        title: "Confirm restore",
        children: (
          <p>
            This will restore cluster member{" "}
            <ItemName item={{ name: member.server_name }} bold />.
          </p>
        ),
        confirmButtonLabel: "Restore",
        onConfirm: handleRestore,
        confirmButtonAppearance: "positive",
      }}
      shiftClickEnabled
      showShiftClickHint
    >
      <span>Restore</span>
    </ConfirmationButton>
  );
};

export default RestoreClusterMemberBtn;
