/**
 * @file: CDevModal.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.11.2024
 * Last Modified Date: 27.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useContext, useState } from "react";

import { CBody } from "@m/base/components/CBody";
import { CButton } from "@m/core/components/CButton";
import { CModal } from "@m/core/components/CModal";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";

export function CDevModal() {
  const [visible, setVisibility] = useState(false);
  const close = useCallback(() => {
    setVisibility(false);
  }, []);

  const { push } = useContext(ContextAreYouSure);

  const handlePushAreYouSure = useCallback(async () => {
    await push("Message", async () => {
      await new Promise((res) => {
        setTimeout(res, 1000);
      });
    });
  }, [push]);

  return (
    <CBody title="Dev - Modals">
      <div className="space-y-4 flex flex-col">
        <div>Are You Sure Modal</div>
        <CButton
          label='Push "Are You Sure" Modal'
          onClick={handlePushAreYouSure}
        />

        <div>Show Modal</div>
        <CButton label="Show Modal" value={true} onClick={setVisibility} />
        {visible && <CModal onClickBg={close}>Modal</CModal>}
      </div>
    </CBody>
  );
}
