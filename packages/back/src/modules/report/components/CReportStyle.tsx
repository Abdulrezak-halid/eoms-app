/**
 * @file: CReportStyle.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 05.09.2025
 * Last Modified Date: 15.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { Style, css } from "hono/css";

export const CReportStyle = () => (
  <Style>
    {css`
      /* ================== Base ================== */
      :root {
        --font-sans: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        --font-mono: Consolas, Menlo, monospace;

        /*
        --color-accent-50: oklch(0.984 0.014 180.72);
        --color-accent-100: oklch(0.953 0.051 180.801);
        --color-accent-200: oklch(0.91 0.096 180.426);
        --color-accent-300: oklch(0.855 0.138 181.071);
        --color-accent-400: oklch(0.777 0.152 181.912);
        --color-accent-500: oklch(0.704 0.14 182.503);
        --color-accent-600: oklch(0.6 0.118 184.704);
        --color-accent-700: oklch(0.511 0.096 186.391);
        --color-accent-800: oklch(0.437 0.078 188.216);
        --color-accent-900: oklch(0.386 0.063 188.416);
        --color-accent-950: oklch(0.277 0.046 192.524);
        */

        --color-accent-50: oklch(0.984 0.014 180.72);
        --color-accent-100: oklch(0.953 0.051 180.801);

        --text: #1f2937;
        --muted: #6b7280;
        --border: #e5e7eb;
        --bg: #ffffff;
        --soft: #f9fafb;
        --accent: oklch(0.511 0.096 186.391);
        --accent-dark: oklch(0.386 0.063 188.416);

        --h1: 28px;
        --h2: 20px;
        --body: 14px;
        /*--radius: 8px;*/
        --page-max: 900px;
        --line: 1.6;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        font-family: var(--font-sans);
        font-size: var(--body);
        line-height: var(--line);
        color: var(--text);
        background: var(--bg);
      }

      body {
        max-width: var(--page-max);
        margin: 0 auto;
        padding: 20px 24px 60px;
      }

      /* ================== Headings ================== */
      h1 {
        font-size: var(--h1);
        font-weight: 800;
        margin-bottom: 4px;
        text-align: center;
      }
      #report-period-info {
        text-align: center;
        color: var(--muted);
        margin-bottom: 24px;
        font-style: italic;
      }

      h2,
      .section-title {
        font-size: var(--h2);
        font-weight: 700;
        margin: 24px 0 12px;
        padding-bottom: 4px;
        border-bottom: 2px solid var(--border);
        color: var(--accent-dark);
      }

      /* ================== Section Blocks ================== */
      .section {
        /* background: var(--soft);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px 20px; */
        margin-bottom: 24px;
      }

      .section-title {
        margin-top: 0;
        margin-bottom: 12px;
      }

      /* ================== Lists ================== */
      ul {
        padding-left: 20px;
        margin: 8px 0 12px;
      }
      li {
        margin-bottom: 6px;
      }

      /* ================== Links ================== */
      a {
        color: var(--accent);
        text-decoration: none;
        border-bottom: 1px solid var(--color-accent-100);
      }
      a:hover {
        border-bottom-color: var(--accent);
      }

      /* ================== Tables ================== */
      .table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0 20px;
        font-size: 13px;
      }
      .table thead,
      .table tbody th {
        background: var(--accent);
        color: white;
      }
      .table th,
      .table td {
        border: 1px solid var(--border);
        padding: 8px 10px;
        vertical-align: top;
        text-align: left;
      }
      .table th.right,
      .table td.right {
        text-align: right;
      }
      .table tbody tr:nth-child(even) {
        background: var(--soft);
      }
      .table tbody tr:hover {
        background: var(--color-accent-50);
      }

      /* ================== Charts ================== */
      .chart > SVG {
      }

      /* ================== Special Blocks ================== */
      #authors {
        margin-bottom: 20px;
      }
      #authors ul {
        list-style: square;
      }

      /* Table of Contents */
      #table-of-contents {
        /* background: var(--soft);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px; */
        margin-bottom: 24px;
      }
      #table-of-contents ul {
        list-style: none;
        padding-left: 0;
      }
      #table-of-contents li {
        margin: 6px 0;
      }
      #table-of-contents a {
        font-weight: 500;
      }

      .placeholder-box {
        background: #eee;
        border: 1px solid #ddd;
        color: #666;
        text-align: center;
        padding: 4rem;
      }

      /* ================== Header ================== */
      .report-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333;
      }
      .report-header-table {
        font-size: inherit;
        line-height: inherit;
      }

      /* ================== Print ================== */
      @media print {
        body {
          padding: 0;
          max-width: none;
          color: black;
        }
        @page {
          size: A4;
          margin: 8mm 12mm 20mm;
          @top-left {
            content: element(pageHeader);
          }
        }
        .report-header {
          margin-bottom: 12mm;
        }
        a {
          color: black;
          border-bottom: 1px solid #999;
        }
        .table thead {
          display: table-header-group;
        }
        .table th,
        .table tbody th {
          color: black;
        }
        .table tr,
        img {
          page-break-inside: avoid;
        }
        .section {
          /*border: 1px solid #ccc;*/
          background: white;
          page-break-inside: avoid;
        }
      }
    `}
  </Style>
);
