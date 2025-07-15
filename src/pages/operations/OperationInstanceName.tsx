import type { FC } from "react";
import type { LxdOperation } from "types/operation";
import ResourceLink from "components/ResourceLink";
import { getInstanceName, getProjectName } from "util/operations";
import ResourceLabel from "components/ResourceLabel";

interface Props {
  operation: LxdOperation;
}

const OperationInstanceName: FC<Props> = ({ operation }) => {
  const projectName = getProjectName(operation);

  const instanceName = getInstanceName(operation);
  if (!instanceName) {
    return null;
  }

  const linkableDescriptions = [
    "Restarting instance",
    "Starting instance",
    "Stopping instance",
    "Unfreezing instance",
    "Freezing instance",
    "Snapshotting instance",
    "Restoring snapshot",
    "Deleting snapshot",
    "Updating snapshot",
    "Updating instance",
    "Renaming instance",
    "Executing command",
    "Showing console",
  ];
  const isLinkable =
    (operation.status === "Success" &&
      operation.description === "Creating instance") ||
    linkableDescriptions.includes(operation.description);

  if (isLinkable && projectName) {
    return (
      <ResourceLink
        type="instance"
        value={instanceName}
        to={`/ui/project/${encodeURIComponent(projectName)}/instance/${encodeURIComponent(instanceName)}`}
      />
    );
  }

  return (
    <div className="u-truncate u-text--muted">
      <ResourceLabel type="instance" value={instanceName} />
    </div>
  );
};
export default OperationInstanceName;
