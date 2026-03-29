/**
 * @file: C404.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.11.2024
 * Last Modified Date: 20.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useMemo } from "react";
import { Frown } from "lucide-react";

import { CBody } from "@m/base/components/CBody";
import { CIcon } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IBreadCrumb } from "../components/CBreadCrumbs";

export function C404() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("dashboard"), path: "/" }],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-center space-x-3 pt-20 pb-10 text-gray-500">
        <CIcon value={Frown} lg />
        <div className="text-3xl">{t("pageNotFound")}</div>
      </CLine>
    </CBody>
  );
}
