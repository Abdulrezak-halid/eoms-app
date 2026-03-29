import { EApiFailCode } from "common";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { SYSADMIN_EMAIL, SYSADMIN_PASSWORD } from "@/constants";
import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterOrganizationBanner", () => {
  it("fetch banner using user session", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });
    const { client: client2, session: session2 } =
      await UtilTest.createClientLoggedIn();

    // Create a banner image with sharp
    const image = await sharp({
      create: { width: 1, height: 1, background: "#fff", channels: 3 },
    })
      .png()
      .toBuffer();
    // Create a file from the image buffer
    const bannerFile = new File([Buffer.from(image)], "banner.png", {
      type: "image/png",
    });

    const upload = await client.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session2.orgId } },
      body: { banner: "" },
      // Create a FormData object and append the banner file
      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
      parseAs: "stream",
    });

    expect(upload).toBeApiOk();
    const res = await client2.GET("/u/organization/banner/{id}", {
      params: { path: { id: session2.orgId } },
      parseAs: "stream",
    });
    expect(res).toBeApiOk();
  });

  it("should throw error when try to fetch other organization banner", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });
    const { session: session2 } = await UtilTest.createClientLoggedIn();

    // Create a banner image with sharp
    const image = await sharp({
      create: { width: 1, height: 1, background: "#fff", channels: 3 },
    })
      .png()
      .toBuffer();
    // Create a file from the image buffer
    const bannerFile = new File([Buffer.from(image)], "banner.png", {
      type: "image/png",
    });

    const upload = await client.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session2.orgId } },
      body: { banner: "" },
      // Create a FormData object and append the banner file
      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
      parseAs: "stream",
    });

    expect(upload).toBeApiOk();
    const res = await client.GET("/u/organization/banner/{id}", {
      params: { path: { id: session2.orgId } },
      parseAs: "stream",
    });
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });
});
