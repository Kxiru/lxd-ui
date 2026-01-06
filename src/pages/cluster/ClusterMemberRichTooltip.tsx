import { type FC } from "react";
import { Spinner } from "@canonical/react-components";
import { type TooltipRow } from "components/RichTooltipRow";
import {
  MEDIUM_TOOLTIP_BREAKPOINT,
  RichTooltipTable,
} from "components/RichTooltipTable";
import { useClusterMember } from "context/useClusterMembers";
import { Link } from "react-router-dom";
import ItemName from "components/ItemName";
import ClusterMemberStatus from "./ClusterMemberStatus";
import { useIsScreenBelow } from "context/useIsScreenBelow";
import ClusterMemberMemoryUsage from "./ClusterMemberMemoryUsage";
import { useQuery } from "@tanstack/react-query";
import { fetchClusterMemberState } from "api/cluster-members";
import { queryKeys } from "util/queryKeys";
import { formatSeconds } from "util/seconds";

interface Props {
  clusterName: string;
}

const ClusterMemberRichTooltip: FC<Props> = ({ clusterName }) => {
  const { data: member, isLoading: isMemberLoading } =
    useClusterMember(clusterName);

  const { data: state } = useQuery({
    queryKey: [
      queryKeys.cluster,
      queryKeys.members,
      member?.server_name ?? undefined,
      queryKeys.state,
    ],
    queryFn: async () => fetchClusterMemberState(member?.server_name ?? ""),
    enabled: !!member,
  });

  if (!member && !isMemberLoading) {
    return (
      <>
        Cluster member <ClusterMemberRichTooltip clusterName={clusterName} />{" "}
        not found
      </>
    );
  }

  const showAdditionalData = !useIsScreenBelow(
    MEDIUM_TOOLTIP_BREAKPOINT,
    "height",
  );

  const memberDescription = member ? member.description || "-" : "-";

  const rows: TooltipRow[] = [
    {
      title: "Cluster member",
      value:
        !member || isMemberLoading ? (
          <Spinner />
        ) : (
          <Link
            to={`/ui/cluster/member/${encodeURIComponent(clusterName)}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ItemName item={{ name: clusterName }} />
          </Link>
        ),
      valueTitle: clusterName,
    },
    {
      title: "Description",
      value: memberDescription,
      valueTitle: memberDescription,
    },
    {
      title: "Status",
      value: member ? <ClusterMemberStatus member={member} /> : "-",
      valueTitle: member ? member.status : "Status",
    },
    {
      title: "Message",
      value: member ? member.message : "-",
      valueTitle: member ? member.message : "Message",
    },
    {
      title: "URL",
      value: member ? member.url : "-",
      valueTitle: member ? member.url : "URL",
    },
    {
      title: "Roles",
      value: member ? member.roles.join(", ") : "-",
      valueTitle: member ? member.roles.join(", ") : "Roles",
    },
  ];

  if (showAdditionalData) {
    rows.push(
      {
        title: "Uptime",
        value: state?.sysinfo.uptime
          ? formatSeconds(state?.sysinfo.uptime)
          : "-",
      },
      {
        title: "Load Average",
        value: state?.sysinfo.load_averages.join(" "),
      },
      {
        title: "Memory Usage",
        value: member ? <ClusterMemberMemoryUsage member={member} /> : "-",
      },
    );
  }

  return <RichTooltipTable rows={rows} />;
};

export default ClusterMemberRichTooltip;
