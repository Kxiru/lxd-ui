import { handleResponse, handleSettledResult } from "util/helpers";
import type { LxdApiResponse } from "types/apiResponse";
import type { IdpGroup } from "types/permissions";
import { withEntitlementsQuery } from "util/entitlements/api";

const idpGroupEntitlements = ["can_delete", "can_edit"];

export const fetchIdpGroups = async (
  isFineGrained: boolean | null,
): Promise<IdpGroup[]> => {
  const entitlements = withEntitlementsQuery(
    isFineGrained,
    idpGroupEntitlements,
  );
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identity-provider-groups?recursion=1${entitlements}`)
      .then(handleResponse)
      .then((data: LxdApiResponse<IdpGroup[]>) => {
        resolve(data.metadata);
      })
      .catch(reject);
  });
};

export const createIdpGroup = async (
  group: Partial<IdpGroup>,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identity-provider-groups`, {
      method: "POST",
      body: JSON.stringify({ name: group.name, groups: group.groups }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const updateIdpGroup = async (group: IdpGroup): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identity-provider-groups/${group.name}`, {
      method: "PUT",
      body: JSON.stringify(group),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const renameIdpGroup = async (
  oldName: string,
  newName: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identity-provider-groups/${oldName}`, {
      method: "POST",
      body: JSON.stringify({
        name: newName,
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteIdpGroup = async (group: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identity-provider-groups/${group}`, {
      method: "DELETE",
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteIdpGroups = async (groups: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    Promise.allSettled(groups.map(async (group) => deleteIdpGroup(group)))
      .then(handleSettledResult)
      .then(resolve)
      .catch(reject);
  });
};
