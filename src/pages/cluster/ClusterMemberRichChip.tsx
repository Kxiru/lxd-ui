import type { FC } from "react";
import { Tooltip } from "@canonical/react-components";
import { useIsScreenBelow } from "context/useIsScreenBelow";
import ResourceLink from "components/ResourceLink";
import { SMALL_TOOLTIP_BREAKPOINT } from "components/RichTooltipTable";
import ClusterMemberRichTooltip from "./ClusterMemberRichTooltip";

interface Props {
  clusterName: string;
  resourceLinkClassName?: string;
  resourceLinkDisabled?: boolean;
}

const ClusterMemberRichChip: FC<Props> = ({
  clusterName,
  resourceLinkClassName,
  resourceLinkDisabled,
}) => {
  const showTooltip = !useIsScreenBelow(SMALL_TOOLTIP_BREAKPOINT, "height");

  const url = `/ui/cluster/member/${encodeURIComponent(clusterName)}`;
  const resourceLink = (
    <ResourceLink
      type="cluster-member"
      value={clusterName}
      to={url}
      hasTitle={!showTooltip}
      className={resourceLinkClassName}
      disabled={resourceLinkDisabled}
    />
  );

  if (!showTooltip) {
    return <>{resourceLink}</>;
  }

  return (
    <Tooltip
      zIndex={1000}
      message={<ClusterMemberRichTooltip clusterName={clusterName} />}
    >
      {resourceLink}
    </Tooltip>
  );
};

export default ClusterMemberRichChip;
