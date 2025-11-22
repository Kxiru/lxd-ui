import type { FC, ReactNode } from "react";
import { Form, Input } from "@canonical/react-components";
import type { FormikProps } from "formik/dist/types";
import AutoExpandingTextArea from "components/AutoExpandingTextArea";
import type { LxdNetwork } from "types/network";
import { useNetworkEntitlements } from "util/entitlements/networks";
import NetworkSelector from "pages/projects/forms/NetworkSelector";
import { useNetworks } from "context/useNetworks";
import { typesWithLocalPeerings } from "util/networks";
import { useProjects } from "context/useProjects";
import ProjectSelector from "./ProjectSelector";

export interface LocalPeeringFormValues {
  name: string;
  targetProject: string;
  targetNetwork: string;
  description?: string;
  customTargetProject?: string;
  customTargetNetwork?: string;
}

interface Props {
  formik: FormikProps<LocalPeeringFormValues>;
  network: LxdNetwork;
  isEditing?: boolean;
}

const NetworkLocalPeeringForm: FC<Props> = ({ formik, network, isEditing }) => {
  const { canEditNetwork } = useNetworkEntitlements();
  const { data: projects = [] } = useProjects();
  const { data: networks = [] } = useNetworks(
    formik.values.targetProject || "default",
  );
  const projectOtherLabel = "Manually enter project";
  const networkOtherLabel = "Manually enter network";
  const projectList = [
    ...projects,
    { name: projectOtherLabel, config: {}, description: "" },
  ];

  const managedNetworks = networks
    .filter((item) => typesWithLocalPeerings.includes(item.type))
    .filter((item) => item.name !== network.name);

  const networkList = [
    ...managedNetworks,
    { name: networkOtherLabel, type: "ovn", config: {} } as LxdNetwork,
  ];

  const getFormProps = (
    id: "name" | "description" | "targetProject" | "targetNetwork",
  ) => {
    return {
      id: id,
      name: id,
      onBlur: formik.handleBlur,
      onChange: formik.handleChange,
      value: formik.values[id] ?? "",
      error: formik.touched[id] ? (formik.errors[id] as ReactNode) : null,
      placeholder: `Enter ${id.replaceAll("-", " ")}`,
    };
  };

  const editRestriction = canEditNetwork(network)
    ? ""
    : "You do not have permission to edit this network";

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className={"local-peering-create-form"}
    >
      {/* hidden submit to enable enter key in inputs */}
      <Input type="submit" hidden value="Hidden input" />
      <Input
        {...getFormProps("name")}
        type="text"
        label="Name"
        required
        autoFocus
        disabled={isEditing || !!editRestriction}
        title={editRestriction}
      />
      <AutoExpandingTextArea
        {...getFormProps("description")}
        label="Description"
        disabled={!!editRestriction}
        title={editRestriction}
      />
      {isEditing ? (
        <Input
          id="customTargetProject"
          type="text"
          label="Target project"
          value={formik.values.targetProject}
          disabled={isEditing}
          title={"Target project cannot be changed"}
          required
        />
      ) : (
        <ProjectSelector
          id="targetProject"
          name="targetProject"
          label="Target project"
          value={formik.values.targetProject}
          setValue={(value) => {
            formik.setFieldValue("targetProject", value);
            if (value !== projectOtherLabel) {
              formik.setFieldValue("customTargetProject", "");
              formik.setFieldValue("targetNetwork", "");
            }
            if (value === projectOtherLabel) {
              formik.setFieldValue("targetNetwork", networkOtherLabel);
            }
          }}
          disabled={!!editRestriction}
          projects={projectList}
          required
        />
      )}

      {formik.values.targetProject === projectOtherLabel && (
        <Input
          id="customTargetProject"
          name="customTargetProject"
          type="text"
          placeholder="Enter target project name"
          value={formik.values.customTargetProject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isEditing || !!editRestriction}
          title={editRestriction}
        />
      )}

      {isEditing ? (
        <Input
          id="customTargetNetwork"
          type="text"
          label="Target network"
          value={formik.values.targetNetwork}
          disabled={isEditing}
          title={"Target network cannot be changed"}
          required
        />
      ) : (
        formik.values.targetProject &&
        formik.values.targetProject !== projectOtherLabel && (
          <NetworkSelector
            id="targetNetwork"
            name="targetNetwork"
            label="Target network"
            value={formik.values.targetNetwork}
            setValue={(value) => {
              formik.setFieldValue("targetNetwork", value);
              if (value !== networkOtherLabel) {
                formik.setFieldValue("customTargetNetwork", "");
              }
            }}
            disabled={isEditing || !!editRestriction}
            managedNetworks={networkList}
            help={
              formik.values.targetNetwork !== networkOtherLabel &&
              "Peering is limited to intra-cluster OVN networks; non-OVN or cross-cluster network peering is not supported."
            }
          />
        )
      )}

      {(formik.values.targetNetwork === networkOtherLabel ||
        formik.values.targetProject === projectOtherLabel) && (
        <Input
          id="customTargetNetwork"
          name="customTargetNetwork"
          type="text"
          label="Target network"
          placeholder="Enter target network name"
          value={formik.values.customTargetNetwork}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isEditing || !!editRestriction}
          title={editRestriction}
          help={
            "Peering is limited to intra-cluster OVN networks; non-OVN or cross-cluster network peering is not supported."
          }
        />
      )}
    </Form>
  );
};

export default NetworkLocalPeeringForm;
