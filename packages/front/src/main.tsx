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
