import { FC, useEffect } from "react";
import { Col, Form, Input, Row, useNotify } from "@canonical/react-components";
import {
  LxdNetwork,
  LxdNetworkBridgeDriver,
  LxdNetworkConfig,
  LxdNetworkDnsMode,
  LxdNetworkType,
} from "types/network";
import NetworkFormMenu, {
  BRIDGE,
  DNS,
  IPV4,
  IPV6,
  MAIN_CONFIGURATION,
  OVN,
  YAML_CONFIGURATION,
} from "pages/networks/forms/NetworkFormMenu";
import { FormikProps } from "formik/dist/types";
import { updateMaxHeight } from "util/updateMaxHeight";
import useEventListener from "util/useEventListener";
import YamlForm from "components/forms/YamlForm";
import NetworkFormMain from "pages/networks/forms/NetworkFormMain";
import NetworkFormBridge from "pages/networks/forms/NetworkFormBridge";
import NetworkFormDns from "pages/networks/forms/NetworkFormDns";
import NetworkFormIpv4 from "pages/networks/forms/NetworkFormIpv4";
import NetworkFormIpv6 from "pages/networks/forms/NetworkFormIpv6";
import { slugify } from "util/slugify";
import { useDocs } from "context/useDocs";
import { getHandledNetworkConfigKeys, getNetworkKey } from "util/networks";
import NetworkFormOvn from "pages/networks/forms/NetworkFormOvn";
import YamlNotification from "components/forms/YamlNotification";
import { ensureEditMode } from "util/instanceEdit";
import { useSettings } from "context/useSettings";
import { isClusteredServer } from "util/settings";

export interface NetworkFormValues {
  readOnly: boolean;
  isCreating: boolean;
  name: string;
  description?: string;
  networkType: LxdNetworkType;
  bridge_driver?: LxdNetworkBridgeDriver;
  bridge_hwaddr?: string;
  bridge_mtu?: string;
  dns_domain?: string;
  dns_mode?: LxdNetworkDnsMode;
  dns_nameservers?: string;
  dns_search?: string;
  ipv4_address?: string;
  ipv4_dhcp?: string;
  ipv4_dhcp_expiry?: string;
  ipv4_dhcp_ranges?: string;
  ipv4_l3only?: string;
  ipv4_nat?: string;
  ipv4_nat_address?: string;
  ipv4_ovn_ranges?: string;
  ipv4_gateway?: string;
  ipv4_routes?: string;
  ipv4_routes_anycast?: string;
  ipv6_address?: string;
  ipv6_dhcp?: string;
  ipv6_dhcp_expiry?: string;
  ipv6_dhcp_ranges?: string;
  ipv6_dhcp_stateful?: string;
  ipv6_l3only?: string;
  ipv6_nat?: string;
  ipv6_nat_address?: string;
  ipv6_ovn_ranges?: string;
  ipv6_gateway?: string;
  ipv6_routes?: string;
  ipv6_routes_anycast?: string;
  network?: string;
  ovn_ingress_mode?: string;
  parent?: string;
  yaml?: string;
  entityType: "network";
  bareNetwork?: LxdNetwork;
}

export const toNetwork = (values: NetworkFormValues): Partial<LxdNetwork> => {
  const excludeMainKeys = new Set([
    "used_by",
    "etag",
    "status",
    "locations",
    "managed",
    "name",
    "description",
    "config",
    "type",
  ]);
  const missingMainFields = Object.fromEntries(
    Object.entries(values.bareNetwork ?? {}).filter(
      (e) => !excludeMainKeys.has(e[0]),
    ),
  );

  const excludeConfigKeys = getHandledNetworkConfigKeys();
  const missingConfigFields = Object.fromEntries(
    Object.entries(values.bareNetwork?.config ?? {}).filter(
      (e) =>
        !excludeConfigKeys.has(e[0] as keyof LxdNetworkConfig) &&
        !e[0].startsWith("volatile"),
    ),
  );

  return {
    ...missingMainFields,
    name: values.name,
    description: values.description,
    type: values.networkType,
    config: {
      ...missingConfigFields,
      [getNetworkKey("bridge_driver")]: values.bridge_driver,
      [getNetworkKey("bridge_hwaddr")]: values.bridge_hwaddr,
      [getNetworkKey("bridge_mtu")]: values.bridge_mtu,
      [getNetworkKey("dns_domain")]: values.dns_domain,
      [getNetworkKey("dns_mode")]: values.dns_mode,
      [getNetworkKey("dns_nameservers")]: values.dns_nameservers,
      [getNetworkKey("dns_search")]: values.dns_search,
      [getNetworkKey("ipv4_address")]: values.ipv4_address,
      [getNetworkKey("ipv4_dhcp")]: values.ipv4_dhcp,
      [getNetworkKey("ipv4_dhcp_expiry")]: values.ipv4_dhcp_expiry,
      [getNetworkKey("ipv4_dhcp_ranges")]: values.ipv4_dhcp_ranges,
      [getNetworkKey("ipv4_l3only")]: values.ipv4_l3only,
      [getNetworkKey("ipv4_nat")]: values.ipv4_nat,
      [getNetworkKey("ipv4_nat_address")]: values.ipv4_nat_address,
      [getNetworkKey("ipv4_ovn_ranges")]: values.ipv4_ovn_ranges,
      [getNetworkKey("ipv4_gateway")]: values.ipv4_gateway,
      [getNetworkKey("ipv4_routes")]: values.ipv4_routes,
      [getNetworkKey("ipv4_routes_anycast")]: values.ipv4_routes_anycast,
      [getNetworkKey("ipv6_address")]: values.ipv6_address,
      [getNetworkKey("ipv6_dhcp")]: values.ipv6_dhcp,
      [getNetworkKey("ipv6_dhcp_expiry")]: values.ipv6_dhcp_expiry,
      [getNetworkKey("ipv6_dhcp_ranges")]: values.ipv6_dhcp_ranges,
      [getNetworkKey("ipv6_dhcp_stateful")]: values.ipv6_dhcp_stateful,
      [getNetworkKey("ipv6_l3only")]: values.ipv6_l3only,
      [getNetworkKey("ipv6_nat")]: values.ipv6_nat,
      [getNetworkKey("ipv6_nat_address")]: values.ipv6_nat_address,
      [getNetworkKey("ipv6_ovn_ranges")]: values.ipv6_ovn_ranges,
      [getNetworkKey("ipv6_gateway")]: values.ipv6_gateway,
      [getNetworkKey("ipv6_routes")]: values.ipv6_routes,
      [getNetworkKey("ipv6_routes_anycast")]: values.ipv6_routes_anycast,
      [getNetworkKey("network")]: values.network,
      [getNetworkKey("ovn_ingress_mode")]: values.ovn_ingress_mode,
      [getNetworkKey("parent")]: values.parent,
    },
  };
};

interface Props {
  formik: FormikProps<NetworkFormValues>;
  getYaml: () => string;
  project: string;
  section: string;
  setSection: (section: string) => void;
  version?: number;
}

const NetworkForm: FC<Props> = ({
  formik,
  getYaml,
  project,
  section,
  setSection,
  version = 0,
}) => {
  const docBaseLink = useDocs();
  const notify = useNotify();
  const { data: settings } = useSettings();
  const isClustered = isClusteredServer(settings);

  const updateFormHeight = () => {
    updateMaxHeight("form-contents", "p-bottom-controls");
  };
  useEffect(updateFormHeight, [notify.notification?.message, section]);
  useEventListener("resize", updateFormHeight);

  return (
    <Form className="form network-form" onSubmit={formik.handleSubmit}>
      {/* hidden submit to enable enter key in inputs */}
      <Input type="submit" hidden value="Hidden input" />
      {section !== slugify(YAML_CONFIGURATION) && (
        <NetworkFormMenu
          active={section}
          setActive={setSection}
          formik={formik}
        />
      )}
      <Row className="form-contents" key={section}>
        <Col size={12}>
          {section === slugify(MAIN_CONFIGURATION) && (
            <NetworkFormMain
              formik={formik}
              project={project}
              isClustered={isClustered}
            />
          )}
          {section === slugify(BRIDGE) && <NetworkFormBridge formik={formik} />}
          {section === slugify(DNS) && <NetworkFormDns formik={formik} />}
          {section === slugify(IPV4) && <NetworkFormIpv4 formik={formik} />}
          {section === slugify(IPV6) && <NetworkFormIpv6 formik={formik} />}
          {section === slugify(OVN) && <NetworkFormOvn formik={formik} />}
          {section === slugify(YAML_CONFIGURATION) && (
            <YamlForm
              key={`yaml-form-${version}`}
              yaml={getYaml()}
              setYaml={(yaml) => {
                ensureEditMode(formik);
                void formik.setFieldValue("yaml", yaml);
              }}
            >
              <YamlNotification
                entity="network"
                href={`${docBaseLink}/explanation/networks/#managed-networks`}
              />
            </YamlForm>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default NetworkForm;
