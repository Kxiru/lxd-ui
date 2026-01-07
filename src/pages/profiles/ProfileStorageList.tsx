import type { FC } from "react";
import type { LxdProfile } from "types/profile";
import { isDiskDevice } from "util/devices";
import ExpandableList from "components/ExpandableList";
import StoragePoolRichChip from "pages/storage/StoragePoolRichChip";

interface Props {
  profile: LxdProfile;
  project: string;
}

const ProfileStorageList: FC<Props> = ({ profile, project }) => {
  return (
    <>
      {Object.values(profile.devices).some(isDiskDevice) ? (
        <ExpandableList
          items={Object.values(profile.devices)
            .filter(isDiskDevice)
            .map((device) => (
              <StoragePoolRichChip
                key={device.path}
                poolName={device.pool || ""}
                projectName={project}
                url={`/ui/project/${encodeURIComponent(project)}/storage/pool/${encodeURIComponent(device.pool ?? "")}`}
              />
            ))}
        />
      ) : (
        <div className="list-item">-</div>
      )}
    </>
  );
};

export default ProfileStorageList;
