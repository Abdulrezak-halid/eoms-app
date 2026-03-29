import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { ChevronDown, ChevronUp } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { classNames } from "@m/core/utils/classNames";

export interface ICShowMoreProps {
  maxHeight?: number;
  className?: string;
  gradientHeight?: number;
}

export function CShowMore({
  children,
  maxHeight = 200,
  className,
  gradientHeight = 80,
}: PropsWithChildren<ICShowMoreProps>) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState<boolean | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setNeedsToggle(contentHeight > maxHeight);
      }
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [maxHeight, children]);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const shouldCollapse = needsToggle === null || (needsToggle && !isExpanded);

  return (
    <div className={classNames("relative", className)}>
      <div
        ref={contentRef}
        className={classNames(
          "overflow-hidden transition-all duration-300",
          shouldCollapse && "relative",
        )}
        style={{
          maxHeight: shouldCollapse
            ? `${maxHeight}px`
            : isExpanded && contentRef.current
              ? `${contentRef.current.scrollHeight}px`
              : undefined,
        }}
      >
        {children}

        {shouldCollapse && needsToggle && (
          <div
            className={classNames(
              "absolute bottom-0 left-0 right-0 flex justify-center items-end",
              "pointer-events-none",
              "bg-gradient-to-t",
              "from-white/80 to-transparent dark:from-gray-800 dark:to-transparent",
            )}
            style={{ height: gradientHeight }}
          >
            <div className="pointer-events-auto mb-1">
              <CButton
                icon={ChevronDown}
                label={t("showMore")}
                onClick={handleToggle}
                tertiary
              />
            </div>
          </div>
        )}
      </div>

      {isExpanded && needsToggle && (
        <div className="flex justify-center mt-2">
          <CButton
            icon={ChevronUp}
            label={t("showLess")}
            onClick={handleToggle}
            tertiary
          />
        </div>
      )}
    </div>
  );
}
