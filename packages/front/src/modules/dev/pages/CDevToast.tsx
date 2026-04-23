/**
 * @file: CDevToast.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.11.2024
 * Last Modified Date: 01.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useContext, useRef } from "react";
import { Star } from "lucide-react";

import { CBody } from "@m/base/components/CBody";
import { CButton } from "@m/core/components/CButton";
import { ContextToast } from "@m/core/contexts/ContextToast";

export function CDevToast() {
  const { push, remove } = useContext(ContextToast);

  const refIndex = useRef(1);

  const refControlledToastId = useRef<number | undefined>(undefined);

  const handlePushSuccess = useCallback(() => {
    push(`Success #${refIndex.current++}`, "success");
  }, [push]);

  const handlePushWarning = useCallback(() => {
    push(`Warning #${refIndex.current++}`, "warning");
  }, [push]);

  const handlePushDanger = useCallback(() => {
    push(`Danger #${refIndex.current++}`, "danger");
  }, [push]);

  const handlePushInfo = useCallback(() => {
    push(`Info #${refIndex.current++}`, "info");
  }, [push]);

  const handlePushMuted = useCallback(() => {
    push(`Muted #${refIndex.current++}`, "muted");
  }, [push]);

  const handlePushCustomIcon = useCallback(() => {
    push(`Custom #${refIndex.current++}`, "success", {
      icon: Star,
    });
  }, [push]);

  const handlePushAll = useCallback(() => {
    push(`Success #${refIndex.current++}`, "success");
    push(`Warning #${refIndex.current++}`, "warning");
    push(`Danger #${refIndex.current++}`, "danger");
    push(`Info #${refIndex.current++}`, "info");
    push(`Muted #${refIndex.current++}`, "muted");
    push(`Custom #${refIndex.current++}`, "success", {
      icon: Star,
    });
  }, [push]);

  const handlePushBulk = useCallback(() => {
    for (let i = 0; i < 20; ++i) {
      push(`Bulk #${refIndex.current++}`, i % 2 ? "success" : "danger");
    }
  }, [push]);

  const handlePushControlled = useCallback(() => {
    if (refControlledToastId.current) {
      remove(refControlledToastId.current);
      refControlledToastId.current = undefined;
      return;
    }
    refControlledToastId.current = push("Controlled.", "danger", {
      controlled: true,
    });
  }, [push, remove]);

  return (
    <CBody title="Dev - Toasts">
      <div className="space-y-4 flex flex-col">
        <div>Push Success</div>

        <CButton label="Push Success" onClick={handlePushSuccess} />

        <div>Push Warning</div>
        <CButton label="Push Warning" onClick={handlePushWarning} />

        <div>Push Danger</div>
        <CButton label="Push Danger" onClick={handlePushDanger} />

        <div>Push Info</div>
        <CButton label="Push Info" onClick={handlePushInfo} />

        <div>Push Muted</div>
        <CButton label="Push Muted" onClick={handlePushMuted} />

        <div>Push Custom Icon</div>
        <CButton
          label="Push Custom Icon"
          icon={Star}
          onClick={handlePushCustomIcon}
        />

        <div>Push All</div>
        <CButton label="Push All" onClick={handlePushAll} />

        <div>Push Toast (x20)</div>
        <CButton label="Push Toast (x20)" onClick={handlePushBulk} />

        <div>Toggle Controlled Toast</div>
        <CButton
          label="Toggle Controlled Toast"
          onClick={handlePushControlled}
        />
      </div>
    </CBody>
  );
}
