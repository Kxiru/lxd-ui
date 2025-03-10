import { randomNameSuffix } from "./name";
import type { Page } from "@playwright/test";
import { gotoURL } from "./navigate";

export const randomSnapshotName = (): string => {
  return `playwright-snapshot-${randomNameSuffix()}`;
};

export const createInstanceSnapshot = async (
  page: Page,
  instance: string,
  snapshot: string,
  project?: string,
) => {
  const route = project ? `/ui/project/${project}/instances` : "/ui";
  await gotoURL(page, route);
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill(instance);
  await page.getByRole("link", { name: instance }).first().click();
  await page.getByTestId("tab-link-Snapshots").click();
  await page.getByRole("button", { name: "Create snapshot" }).first().click();
  await page.getByLabel("Snapshot name").click();
  await page.getByLabel("Snapshot name").fill(snapshot);
  await page
    .getByRole("dialog", {
      name: `Create snapshot`,
    })
    .getByRole("button", { name: "Create snapshot" })
    .click();

  await page.waitForSelector(
    `text=Snapshot ${snapshot} created for instance ${instance}.`,
  );
};

export const restoreInstanceSnapshot = async (
  page: Page,
  instance: string,
  snapshot: string,
) => {
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot })
    .hover();
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot })
    .getByRole("button", { name: "Restore" })
    .click();
  await page
    .getByRole("dialog", { name: "Confirm restore" })
    .getByRole("button", { name: "Restore" })
    .click();

  await page.waitForSelector(
    `text=Snapshot ${snapshot} restored for instance ${instance}.`,
  );
};

export const editInstanceSnapshot = async (
  page: Page,
  oldName: string,
  newName: string,
  instance: string,
) => {
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: oldName })
    .hover();
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: oldName })
    .getByRole("button", { name: "Edit snapshot" })
    .click();
  await page.getByLabel("Snapshot name").click();
  await page.getByLabel("Snapshot name").fill(newName);
  await page.getByLabel("Expiry date").click();
  await page.getByLabel("Expiry date").fill("2093-04-28");
  await page.getByLabel("Expiry time").click();
  await page.getByLabel("Expiry time").fill("12:23");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page
    .getByText(`Snapshot ${newName} saved for instance ${instance}.`)
    .click();
  await page.getByText("Apr 28, 2093, 12:23 PM").click();
};

export const deleteInstanceSnapshot = async (
  page: Page,
  instance: string,
  snapshot: string,
) => {
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot })
    .hover();
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot })
    .getByRole("button", { name: "Delete" })
    .click();
  await page
    .getByRole("dialog", { name: "Confirm delete" })
    .getByRole("button", { name: "Delete snapshot" })
    .click();

  await page.waitForSelector(
    `text=Snapshot ${snapshot} deleted for instance ${instance}.`,
  );
};

export const createStorageVolumeSnapshot = async (
  page: Page,
  volume: string,
  snapshot: string,
) => {
  // Create snapshot
  await page.getByRole("link", { name: volume }).click();
  await page.getByTestId("tab-link-Snapshots").click();
  await page.getByRole("button", { name: "Create snapshot" }).click();
  await page.getByLabel("Snapshot name").click();
  await page.getByLabel("Snapshot name").fill(snapshot);
  await page.getByRole("button", { name: "Create snapshot" }).last().click();
  await page.waitForSelector(
    `text=Snapshot ${snapshot} created for volume ${volume}.`,
  );
};

export const restoreStorageVolumeSnapshot = async (
  page: Page,
  volume: string,
  snapshot: string,
) => {
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot })
    .hover();
  await page.getByRole("button", { name: "Restore" }).click();
  await page
    .getByRole("dialog", { name: "Confirm restore" })
    .getByRole("button", { name: "Restore" })
    .click();
  await page.waitForSelector(
    `text=Snapshot ${snapshot} restored for volume ${volume}.`,
  );
};

export const editStorageVolumeSnapshot = async (
  page: Page,
  oldName: string,
  newName: string,
) => {
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: oldName })
    .hover();
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: oldName })
    .getByRole("button", { name: "Edit snapshot" })
    .click();
  await page.getByLabel("Snapshot name").click();
  await page.getByLabel("Snapshot name").fill(newName);
  await page.getByLabel("Expiry date").click();
  await page.getByLabel("Expiry date").fill("2093-04-28");
  await page.getByLabel("Expiry time").click();
  await page.getByLabel("Expiry time").fill("12:23");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByText(`Snapshot ${newName} saved.`).click();
  await page.getByText("Apr 28, 2093, 12:23 PM").click();
  await page.waitForSelector(`text=Snapshot ${newName} saved.`);
};

export const deleteStorageVolumeSnapshot = async (
  page: Page,
  volume: string,
  snapshot: string,
) => {
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot })
    .hover();
  await page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot })
    .getByRole("button", { name: "Delete" })
    .click();
  await page
    .getByRole("dialog", { name: "Confirm delete" })
    .getByRole("button", { name: "Delete snapshot" })
    .click();

  await page.waitForSelector(
    `text=Snapshot ${snapshot} deleted for volume ${volume}.`,
  );
};

export const createImageFromSnapshot = async (page: Page, snapshot: string) => {
  const row = page
    .getByRole("row", { name: "Name" })
    .filter({ hasText: snapshot });
  await row.hover();
  await row.getByRole("button", { name: "Create image" }).click();

  await page.getByLabel("Alias").fill(`alias-${snapshot}`);

  await page
    .getByLabel("Create image from instance")
    .getByRole("button", { name: "Create image" })
    .click();

  await page.waitForSelector(`text=Image created from snapshot ${snapshot}`);
};
