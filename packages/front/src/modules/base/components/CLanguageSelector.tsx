import { useTolgee } from "@tolgee/react";
import { Globe } from "lucide-react";
import { useCallback, useMemo } from "react";

import { CCombobox } from "@m/core/components/CCombobox";
import { CDropdown } from "@m/core/components/CDropdown";
import { CFlag } from "@m/core/components/CFlag";

import { LOCAL_STORAGE_KEY_LANGUAGE } from "../constants/LocalStorageKeys";

export function CLanguageSelector({
  inputMode,
  hideLabelLg,
}: {
  inputMode?: boolean;
  hideLabelLg?: boolean;
}) {
  const tolgee = useTolgee();

  const handleLanguageChange = useCallback(
    async (value?: string) => {
      if (!value) {
        return;
      }
      await tolgee.changeLanguage(value);
      window.localStorage.setItem(LOCAL_STORAGE_KEY_LANGUAGE, value);
    },
    [tolgee],
  );

  // onClick is defined only for dropdown mode
  const languageList = useMemo(
    () => [
      {
        icon: <CFlag value="us" />,
        label: "English",
        value: "en",
        onClick: () => handleLanguageChange("en"),
      },
      {
        icon: <CFlag value="tr" />,
        label: "Türkçe",
        value: "tr-TR",
        onClick: () => handleLanguageChange("tr-TR"),
      },
    ],
    [handleLanguageChange],
  );

  const selectedLanguage = tolgee.getLanguage();

  const selectedListItem = useMemo(
    () => languageList.find((l) => l.value === selectedLanguage),
    [languageList, selectedLanguage],
  );

  if (inputMode) {
    return (
      <CCombobox
        icon={Globe}
        list={languageList}
        value={selectedLanguage}
        onChange={handleLanguageChange}
        noClear
        required
      />
    );
  }

  return (
    <CDropdown
      icon={selectedListItem?.icon || Globe}
      list={languageList}
      tertiary
      hideLabelLg={hideLabelLg}
      noIconRight
      selectedItem={selectedListItem}
      label={selectedListItem?.label}
    />
  );
}
