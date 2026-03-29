/**
 * @file: CAreYouSure.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.11.2024
 * Last Modified Date: 09.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useContext, useState } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { ContextAreYouSure } from "../contexts/ContextAreYouSure";
import { CButton } from "./CButton";
import { CModal } from "./CModal";

export function CAreYouSure() {
  const { t } = useTranslation();

  const { remove, items } = useContext(ContextAreYouSure);

  const item = items.at(-1)!;

  const [busy, setBusy] = useState(false);

  const handleYes = useCallback(async () => {
    setBusy(true);
    await item.cb();
    remove(item);
    setBusy(false);
  }, [remove, item]);

  const handleCancel = useCallback(() => {
    remove(item);
  }, [remove, item]);

  const handleBgCancel = useCallback(() => {
    remove(item);
  }, [remove, item]);

  if (!items.length) {
    return null;
  }

  return (
    <CModal onClickBg={busy ? undefined : handleBgCancel}>
      <div className="p-2">
        <div className="text-xl">{t("areYouSureToProceed")}</div>
        {item.message && <div>{item.message}</div>}
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <CButton label={t("cancel")} onClick={handleCancel} disabled={busy} />
        <CButton label={t("yes")} primary onClick={handleYes} disabled={busy} />
      </div>
    </CModal>
  );
}
