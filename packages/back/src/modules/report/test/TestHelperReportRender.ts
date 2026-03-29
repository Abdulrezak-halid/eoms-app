import prettier from "prettier";

export namespace TestHelperReportRender {
  export async function prettyHtml(html?: string): Promise<string> {
    return await prettier.format(html || "", {
      parser: "html",
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      htmlWhitespaceSensitivity: "ignore",
    });
  }
}
