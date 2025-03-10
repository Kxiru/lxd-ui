import type { FC } from "react";
import { usePortal } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-components";
import type { LxdStorageVolume, LxdVolumeSnapshot } from "types/storage";
import EditVolumeSnapshotForm from "pages/storage/forms/EditVolumeSnapshotForm";

interface Props {
  volume: LxdStorageVolume;
  snapshot: LxdVolumeSnapshot;
  isDeleting: boolean;
  isRestoring: boolean;
}

const VolumeEditSnapshotBtn: FC<Props> = ({
  volume,
  snapshot,
  isDeleting,
  isRestoring,
}) => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal();

  return (
    <>
      {isOpen && (
        <Portal>
          <EditVolumeSnapshotForm
            close={closePortal}
            volume={volume}
            snapshot={snapshot}
          />
        </Portal>
      )}
      <Button
        appearance="base"
        hasIcon
        dense={true}
        disabled={isDeleting || isRestoring}
        onClick={openPortal}
        type="button"
        aria-label="Edit snapshot"
        title="Edit"
      >
        <Icon name="edit" />
      </Button>
    </>
  );
};

export default VolumeEditSnapshotBtn;
