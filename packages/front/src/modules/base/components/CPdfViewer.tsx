import { TriangleAlert } from "lucide-react";

import { CMessageText } from "@m/core/components/CMessageText";
import { useTranslation } from "@m/core/hooks/useTranslation";

interface ICPdfViewerProps {
  src: string;
}

export function CPdfViewer({ src }: ICPdfViewerProps) {
  const { t } = useTranslation();

  return (
    <object className="w-full grow" data={src} type="application/pdf">
      <CMessageText
        className="py-16"
        icon={TriangleAlert}
        value={t("cannotViewFile")}
        type="warning"
      />
    </object>
  );
}
