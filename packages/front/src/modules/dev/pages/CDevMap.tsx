import { useState } from "react";

import { CBody } from "@m/base/components/CBody";
import { CMap } from "@m/base/components/CMap";
import { IMapLocation } from "@m/base/interfaces/IMapLocation";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CDevMap() {
  const { t } = useTranslation();

  const [location, setLocation] = useState<IMapLocation>();

  return (
    <CBody title="Dev - Map">
      <div>Map Input</div>
      <CMap value={location} onChange={setLocation} />

      {location && (
        <p className="mt-4 text-center">
          {t("selected")}: {location.lat.toFixed(5)},{location.long.toFixed(5)}
        </p>
      )}
    </CBody>
  );
}
