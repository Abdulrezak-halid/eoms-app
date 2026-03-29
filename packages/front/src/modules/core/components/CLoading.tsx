import { useTranslation } from "@m/core/hooks/useTranslation";

import { classNames } from "../utils/classNames";
import { CLine } from "./CLine";
import { CSpinner } from "./CSpinner";

export function CLoading({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CLine
      className={classNames(
        "items-center space-x-2 justify-center text-gray-600 dark:text-gray-300",
        className,
      )}
    >
      <CSpinner />
      <div>{t("loading")}</div>
    </CLine>
  );
}
