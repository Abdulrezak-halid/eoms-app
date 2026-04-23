/**
 * @file: main
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 17.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { TolgeeProvider } from "@tolgee/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { CProviders } from "@m/base/layout/CProviders";
import { tolgee } from "@m/core/utils/tolgee";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TolgeeProvider tolgee={tolgee} fallback={<CProviders />}>
      <CProviders />
    </TolgeeProvider>
  </StrictMode>,
);
