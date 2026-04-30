import mermaid from "mermaid";
import { useEffect, useId, useMemo, useRef } from "react";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "neutral",
});

export function CMermaidDiagram({ value }: { value: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderId = useId().replace(/:/g, "");

  const sanitizedValue = useMemo(() => value.trim(), [value]);

  useEffect(() => {
    let active = true;

    const render = async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        const { svg } = await mermaid.render(
          `mermaid-${renderId}`,
          sanitizedValue,
        );

        if (active && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        if (active && containerRef.current) {
          containerRef.current.textContent =
            error instanceof Error ? error.message : "Unable to render diagram.";
        }
      }
    };

    void render();

    return () => {
      active = false;
    };
  }, [renderId, sanitizedValue]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div ref={containerRef} className="min-w-max" />
    </div>
  );
}