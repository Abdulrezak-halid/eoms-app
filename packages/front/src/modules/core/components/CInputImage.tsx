import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { CIcon } from "./CIcon";
import { CLoading } from "./CLoading";
import { CMutedText } from "./CMutedText";

export function CInputImage({
  value = null,
  onChange,
  existingImageUrl,
  accept,
  maxSize,
  disabled,
}: {
  value?: File | null;
  onChange: (file: File | null) => void;
  existingImageUrl?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(existingImageUrl));

  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value],
  );
  const displayUrl = previewUrl || existingImageUrl;
  const hasImage = !!displayUrl;

  const validateAndSetFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null);
        setErrorMessage(null);
        return;
      }
      if (maxSize && file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
        setErrorMessage(t("fileSizeExceeded", { size: `${maxSizeMB}MB` }));
        return;
      }
      onChange(file);
      setErrorMessage(null);
    },
    [maxSize, onChange, t],
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        validateAndSetFile(files[0]);
      }
    },
    [validateAndSetFile],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      e.target.value = "";
    },
    [handleFileSelect],
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [disabled, handleFileSelect],
  );

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const baseClasses = "relative w-full rounded-lg border-2";
  const stateClasses = disabled
    ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
    : "cursor-pointer";
  const borderClasses = errorMessage
    ? "border-red-500"
    : isDragging
      ? "border-blue-500"
      : "border-gray-300 dark:border-gray-600";
  const styleClasses = hasImage ? "border-solid p-0" : "border-dashed p-4";

  return (
    <div>
      <div
        className={classNames(
          baseClasses,
          stateClasses,
          borderClasses,
          styleClasses,
        )}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {hasImage ? (
          <div className="relative min-h-24">
            {isLoading && (
              <div className="h-full absolute w-full flex items-center justify-center">
                <CLoading />
              </div>
            )}
            <img
              src={displayUrl}
              className="w-full h-auto rounded-md"
              onLoad={handleLoad}
              onError={handleLoad}
            />
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <CIcon value={Image} className="w-12 h-12 mb-2" />
            <div className="font-semibold">
              {t("clickToUploadOrDragAndDrop")}
            </div>
            <CMutedText>{t("maxFileSize2mb")}</CMutedText>
          </div>
        )}
      </div>
      {errorMessage && <CMutedText className="mt-1">{errorMessage}</CMutedText>}
    </div>
  );
}
