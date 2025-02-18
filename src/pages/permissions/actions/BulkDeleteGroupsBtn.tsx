import { FC, useState } from "react";
import { Button, Icon } from "@canonical/react-components";
import type { LxdGroup } from "types/permissions";
import DeleteGroupModal from "./DeleteGroupModal";
import { pluralize } from "util/instanceBulkActions";
import { useGroupEntitlements } from "util/entitlements/groups";

interface Props {
  groups: LxdGroup[];
  onDelete: () => void;
  className?: string;
}

const BulkDeleteGroupsBtn: FC<Props> = ({ groups, className, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  const { canDeleteGroup } = useGroupEntitlements();
  const deletableGroups = groups.filter(canDeleteGroup);

  const handleConfirmDelete = () => {
    setConfirming(true);
  };

  const handleCloseConfirm = () => {
    onDelete();
    setConfirming(false);
  };

  return (
    <>
      <Button
        onClick={handleConfirmDelete}
        aria-label="Delete groups"
        title={
          deletableGroups.length
            ? "Delete groups"
            : `You do not have permission to delete the selected ${pluralize("group", groups.length)}`
        }
        className={className}
        hasIcon
        disabled={!deletableGroups.length}
      >
        <Icon name="delete" />
        <span>{`Delete ${groups.length} ${pluralize("group", groups.length)}`}</span>
      </Button>
      {confirming && (
        <DeleteGroupModal groups={groups} close={handleCloseConfirm} />
      )}
    </>
  );
};

export default BulkDeleteGroupsBtn;
