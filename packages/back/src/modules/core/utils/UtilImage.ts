import sharp, { AvailableFormatInfo } from "sharp";

export namespace UtilImage {
  export async function convert(
    file: Buffer,
    settings?: {
      convertTo?: AvailableFormatInfo;
      width?: number;
      height?: number;
    },
  ) {
    const image = sharp(file);
    let { height } = settings || {};

    const { convertTo, width } = settings || {};

    if (width && !height) {
      const aspect = await image
        .metadata()
        .then((meta) => meta.height / meta.width);
      height = Math.round(width * aspect);
    }

    const newImage = image
      .resize(width, height)
      .toFormat(convertTo || sharp.format.webp);

    const metadata = await newImage.metadata();

    return {
      buffer: await newImage.toBuffer(),
      contentType: `image/${metadata.format}`,
    };
  }
}
