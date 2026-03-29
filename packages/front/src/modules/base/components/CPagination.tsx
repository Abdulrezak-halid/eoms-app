import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { Ellipsis } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CIcon } from "@m/core/components/CIcon";
import { CMutedText } from "@m/core/components/CMutedText";
import { classNames } from "@m/core/utils/classNames";

export type IPaginationProps = {
  totalRecordCount: number;
  pageRecordCount: number;
  value: number;
  onChange: (value: number) => void;
  alignRight?: boolean;
};

export function CPagination({
  totalRecordCount,
  pageRecordCount,
  value,
  onChange,
  alignRight,
}: IPaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalRecordCount / pageRecordCount);
  const currentPage = value;

  const startRecord = (currentPage - 1) * pageRecordCount + 1;
  const endRecord = Math.min(currentPage * pageRecordCount, totalRecordCount);

  const pageList = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | null)[] = [];
    pages.push(1);

    let left: number;
    let right: number;

    if (currentPage <= 3) {
      left = 2;
      right = 4;
    } else if (currentPage >= totalPages - 2) {
      left = totalPages - 3;
      right = totalPages - 1;
    } else {
      left = currentPage - 1;
      right = currentPage + 1;
    }

    if (left > 2) {
      pages.push(null);
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push(null);
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div>
      <div
        className={classNames(
          "flex items-center gap-2",
          alignRight ? "justify-end" : "justify-center",
        )}
      >
        {pageList.map((page, index) =>
          page === null ? (
            <CIcon
              key={index}
              className="text-gray-500"
              value={Ellipsis}
            />
          ) : (
            <CButton
              key={index}
              value={page}
              onClick={onChange}
              label={page.toString()}
              primary={page === currentPage}
            />
          ),
        )}
      </div>
      <div
        className={classNames(
          "mt-2",
          alignRight ? "text-right" : "text-center",
        )}
      >
        <CMutedText>
          {t("paginationDescription", {
            firstAndLastRecord: `${startRecord} - ${endRecord}`,
            totalRecordCount: totalRecordCount,
          })}
        </CMutedText>
      </div>
    </div>
  );
}
