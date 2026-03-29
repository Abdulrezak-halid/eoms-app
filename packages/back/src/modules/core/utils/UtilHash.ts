export namespace UtilHash {
  export async function sha256(strData: string) {
    // See: https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
    const digest = await crypto.subtle.digest(
      { name: "SHA-256" },
      new TextEncoder().encode(strData),
    );
    // Binary to hexadecimal
    const buffer = Array.from(new Uint8Array(digest));
    return buffer.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
