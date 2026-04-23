import { ArrowUp, ChevronRight, Ellipsis } from "lucide-react";
import { Fragment, useMemo } from "react";

import { CButton } from "@m/core/components/CButton";
import { CIcon } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";
import { classNames } from "@m/core/utils/classNames";

export interface IBreadCrumb {
  label?: string;
  path?: IRoutePath;
  onClick?: () => void;
  dynamic?: boolean;
}

export function CBreadCrumbs({
  value,
  noBack,
  className,
}: {
  value: IBreadCrumb[];
  noBack?: boolean;
  className?: string;
}) {
  const lastButton = useMemo(() => {
    if (noBack) {
      return undefined;
    }

    for (let i = value.length - 1; i >= 0; --i) {
      const item = value[i];
      if (!item.label) {
        return null;
      }
      if (item.path || item.onClick) {
        return item;
      }
    }

    return undefined;
  }, [value, noBack]);

  return (
    <CLine className={classNames("h-12 w-full", className)}>
      {lastButton !== undefined && (
        <div className="block @sm:hidden @md:block mr-2">
          {lastButton === null ? (
            <CButton icon={ArrowUp} disabled />
          ) : lastButton.path ? (
            <CLink icon={ArrowUp} path={lastButton.path} />
          ) : (
            <CButton icon={ArrowUp} onClick={lastButton.onClick} />
          )}
        </div>
      )}

      {value.map((d, i) => (
        <Fragment key={i}>
          <div
            className={classNames(
              !d.path && !d.onClick && "min-w-0",
              // // If last section is a text section, do not shrink
              // i === value.length - 1 && !d.path && !d.onClick && "shrink-0",
              i !== value.length - 1 && "hidden @sm:block",
            )}
          >
            {!d.label ? (
              <div className="text-gray-400 dark:text-gray-600 px-5">
                <CIcon value={Ellipsis} />
              </div>
            ) : d.path ? (
              <CLink label={d.label} path={d.path} />
            ) : d.onClick ? (
              <CButton label={d.label} onClick={d.onClick} />
            ) : (
              <div
                className={classNames(
                  "py-3 font-bold leading-5 truncate",
                  i === 0 && "@sm:pl-3",
                  d.dynamic
                    ? // px-1 (right side) is for italic font that overflows and clipped
                      "text-sky-600 dark:text-sky-300 font-bold italic px-1"
                    : "text-gray-600 dark:text-gray-200",
                )}
                title={d.label}
              >
                {d.label}
              </div>
            )}
          </div>

          {i !== value.length - 1 && (
            <CIcon
              value={ChevronRight}
              className="text-gray-400 hidden @sm:block"
            />
          )}
        </Fragment>
      ))}
    </CLine>
  );
}
