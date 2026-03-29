import { Ellipsis, File, X } from "lucide-react";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CButton } from "./CButton";
import { CIcon, IconType } from "./CIcon";
import { CInputContainer } from "./CInputContainer";

export function CInputFile({
  icon,
  placeholder,
  value = [],
  onChange,
  onInvalidMsg,
  disabled,
  invalid,
  required,
  accept,
  maxSize,
  multiple = false,
  rightComp,
  className,
}: {
  icon?: IconType;
  placeholder?: string;
  value?: File[];
  onChange?: (value: File[]) => void;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  rightComp?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const invalidFinal = useMemo(() => {
    if (disabled) {
      return false;
    }
    if (required && value.length === 0) {
      return true;
    }
    if (maxSize && value.some((f) => f.size > maxSize)) {
      return true;
    }
    return invalid;
  }, [value, required, maxSize, disabled, invalid]);

  useEffect(() => {
    if (!onInvalidMsg) {
      return;
    }
    if (!invalidFinal) {
      return onInvalidMsg("");
    }

    let msg = "";
    if (required && value.length === 0) {
      msg = t("required");
    } else if (maxSize && value.some((f) => f.size > maxSize)) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
      msg = t("fileSizeExceeded", { size: `${maxSizeMB}MB` });
    }
    onInvalidMsg(msg);
  }, [value, invalidFinal, maxSize, required, t, onInvalidMsg]);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files ? Array.from(e.target.files) : [];
      if (!selected.length) {
        return;
      }

      const newFiles = multiple ? [...value, ...selected] : selected;
      onChange?.(newFiles);
      e.target.value = "";
    },
    [multiple, value, onChange],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(
    (index: number) => () => {
      const newFiles = value.filter((_, i) => i !== index);
      onChange?.(newFiles);
    },
    [value, onChange],
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      <CInputContainer
        disabled={disabled}
        invalid={invalidFinal}
        icon={icon}
        noFocusWithin
      >
        <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between p-2 gap-2">
          <div className="gap-2 flex flex-wrap grow min-w-0">
            {value.length === 0 ? (
              <div className="x-placeholder px-1">
                {placeholder || t("noFileSelected")}
              </div>
            ) : (
              value.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 rounded-md min-w-0"
                >
                  <div className="pl-3 pr-2 flex items-center space-x-3 overflow-hidden">
                    <CIcon
                      value={File}
                      className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm truncate text-gray-800 dark:text-gray-100">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <CButton
                    icon={X}
                    onClick={handleRemoveFile(index)}
                    classNameContainer="p-1"
                    tertiary
                    disabled={disabled}
                  />
                </div>
              ))
            )}
          </div>

          <CButton
            label={
              value.length === 0
                ? t("browse")
                : multiple
                  ? t("addFile")
                  : t("change")
            }
            iconRight={Ellipsis}
            onClick={handleClick}
            disabled={disabled}
          />
        </div>
        {rightComp}
      </CInputContainer>
    </div>
  );
}
