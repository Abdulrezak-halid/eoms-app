/**
 * @file: CDarkThemeSwitch.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.12.2024
 * Last Modified Date: 01.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useContext } from "react";
import { Moon, Sun } from "lucide-react";

import { CSwitch } from "@m/core/components/CSwitch";
import { ContextTheme } from "@m/core/contexts/ContextTheme";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CDarkThemeSwitch() {
  const { t } = useTranslation();
  const contextTheme = useContext(ContextTheme);

  return (
    <CSwitch
      selected={contextTheme.dark}
      onChange={contextTheme.setDark}
      iconOff={Sun}
      iconOn={Moon}
      label={t("darkTheme")}
    />
  );
}
