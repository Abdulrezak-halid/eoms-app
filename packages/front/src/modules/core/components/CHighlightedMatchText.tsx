import { useMemo } from "react";

export function CHighlightedMatchText({
  value,
  query,
}: {
  value: string;
  query?: string;
}) {
  const nodes = useMemo(() => {
    if (!query) {
      return value;
    }

    const pattern = new RegExp(`(${query})`, "gi");
    const parts = value.split(pattern);

    return parts.map((part, idx) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <span key={idx} className="bg-yellow-200 dark:bg-yellow-500/50">
            {part}
          </span>
        );
      }

      return part;
    });
  }, [value, query]);

  return nodes;
}
