import { EApiFailCode } from "common";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterUSysOrganizationBanner", () => {
  it("upload a banner image", async () => {
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

    const bannerRes = await client.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      body: { banner: "May the formData with you." },
      // Create a FormData object and append the banner file
      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
      parseAs: "stream",
    });

    expect(bannerRes).toBeApiOk();

    const res = await client.GET("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      parseAs: "stream",
    });
    expect(res).toBeApiOk();
  });

  it("delete banner image", async () => {
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

    const resPut = await client.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      body: { banner: "May the formData with you." },
      // Create a FormData object and append the banner file
      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
      parseAs: "stream",
    });
    expect(resPut).toBeApiOk();

    const resDelete = await client.DELETE(
      "/u/sys/organization/item/{id}/banner",
      {
        params: { path: { id: session.orgId } },
      },
    );
    expect(resDelete).toBeApiOk();

    const res = await client.GET("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      parseAs: "stream",
    });
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);

    const getOrgRes = await client.GET("/u/sys/organization/item/{id}", {
      params: { path: { id: session.orgId } },
    });
    expect(getOrgRes).toBeApiOk();
    expect(getOrgRes.data?.hasBanner).toBe(false);
  });

  it("upload a image with wrong format", async () => {
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
      type: "image/bmp",
    });

    const bannerRes = await client.PUT("/u/sys/organization/item/{id}/banner", {
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

    expect(bannerRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("check image format and width", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

    // Create a banner image with sharp
    const image = await sharp({
      create: { width: 1024, height: 1024, background: "#fff", channels: 3 },
    })
      .png()
      .toBuffer();

    // Create a file from the image buffer
    const bannerFile = new File([Buffer.from(image)], "banner.png", {
      type: "image/png",
    });

    // Upload banner
    await client.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      body: { banner: "" },
      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
      parseAs: "stream",
    });

    // Download banner
    const res = await client.GET("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      parseAs: "arrayBuffer",
    });

    expect(res).toBeApiOk();

    // Check image format using sharp
    const buffer = Buffer.from(res.data!);
    const metadata = await sharp(buffer).metadata();

    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(512);
    expect(metadata.height).toBe(512);
  });

  it("after setting banner image, organization hasBanner should be set", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

    const getOrgRes = await client.GET("/u/sys/organization/item/{id}", {
      params: { path: { id: session.orgId } },
    });
    expect(getOrgRes).toBeApiOk();
    expect(getOrgRes.data?.hasBanner).toBe(false);

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

    const bannerRes = await client.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id: session.orgId } },
      body: { banner: "May the formData with you." },
      // Create a FormData object and append the banner file
      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
      parseAs: "stream",
    });

    expect(bannerRes).toBeApiOk();

    const getOrgRes2 = await client.GET("/u/sys/organization/item/{id}", {
      params: { path: { id: session.orgId } },
    });
    expect(getOrgRes2).toBeApiOk();
    expect(getOrgRes2.data?.hasBanner).toBe(true);
  });
});
