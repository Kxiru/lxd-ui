import { FC } from "react";
import { LxdIdentity } from "types/permissions";
import ResourceLabel from "./ResourceLabel";

interface Props {
  identity: LxdIdentity;
  truncate?: boolean;
}

const IdentityResource: FC<Props> = ({ identity, truncate }) => {
  const authMethod =
    identity.authentication_method == "tls" ? "certificate" : "oidc-identity";

  return (
    <ResourceLabel
      type={authMethod}
      value={identity.type}
      truncate={truncate}
    />
  );
};
export default IdentityResource;
