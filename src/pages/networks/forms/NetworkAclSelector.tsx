import type { FC, ReactNode } from "react";
import { MultiSelect } from "@canonical/react-components";
import { useNetworkAcls } from "context/useNetworkAcls";

interface Props {
  project: string;
  setSelectedAcls: (acls: string[]) => void;
  selectedAcls: string[];
  id?: string;
  inheritedAcls?: string[];
  help?: ReactNode;
  canSelectManualAcls?: boolean;
}

const NetworkAclSelector: FC<Props> = ({
  project,
  setSelectedAcls,
  selectedAcls,
  id = "network-acl-selector",
  inheritedAcls,
  help,
  canSelectManualAcls = true,
}) => {
  const { data: availableAcls = [] } = useNetworkAcls(project);

  const toOptionList = (list: string[], inheritedAcls?: string[]) => {
    return list.map((item) => {
      return {
        label: inheritedAcls?.includes(item) ? `${item} (from network)` : item,
        value: item,
      };
    });
  };

  const hasAcls = availableAcls.length > 0;

  const getPlaceholder = () => {
    if (!canSelectManualAcls) {
      return "-";
    }
    if (!hasAcls) {
      return "No ACLs available";
    }
    if (hasAcls) {
      return "Select ACLs";
    }
  };

  return (
    <MultiSelect
      items={toOptionList(
        availableAcls.map((acl) => acl.name),
        inheritedAcls,
      )}
      disabled={!hasAcls || !canSelectManualAcls}
      selectedItems={toOptionList(selectedAcls)}
      variant={hasAcls ? "condensed" : "search"}
      placeholder={getPlaceholder()}
      onItemsUpdate={(items) => {
        setSelectedAcls(items.map((item) => item.value as string));
      }}
      showDropdownFooter={false}
      id={id}
      disabledItems={inheritedAcls?.map((t) => {
        return { label: t, value: t };
      })}
      help={help}
    />
  );
};

export default NetworkAclSelector;
