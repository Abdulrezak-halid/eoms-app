import { useCallback, useEffect, useState } from "react";
import { Image, TriangleAlert } from "lucide-react";

import { CIcon } from "@m/core/components/CIcon";
import { classNames } from "@m/core/utils/classNames";

export function CDisplayImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  if (!src || hasError) {
    return (
      <div
        className={classNames(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-2",
          className,
        )}
      >
        <CIcon
          value={hasError ? TriangleAlert : Image}
          className="opacity-50"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={classNames("rounded-sm", className)}
      onError={handleImageError}
    />
  );
}
