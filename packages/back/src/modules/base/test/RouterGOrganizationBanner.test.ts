import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterGOrganizationBanner", () => {
  it("fetch banner using referer workspace", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

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

    await client.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      body: { banner: "" },
      // Create a FormData object and append the banner file
      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
      parseAs: "stream",
    });

    // UtilTest works on 'example' workspace
    const res = await client.GET("/g/organization-banner", {
      params: { header: { referer: "http://example" } },
      parseAs: "stream",
    });
    expect(res).toBeApiOk();
  });
});
