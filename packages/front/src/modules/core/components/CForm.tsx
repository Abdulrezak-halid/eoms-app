/**
 * @file: CForm.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 29.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { FormEvent, PropsWithChildren, useCallback, useState } from "react";

export function CForm({
  onSubmit,
  children,
  className,
}: PropsWithChildren<{
  onSubmit?: () => void | Promise<void>;
  className?: string;
}>) {
  const [pending, setPending] = useState(false);
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        setPending(true);
        await onSubmit();
        setPending(false);
      }
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className={className}>
      <fieldset disabled={pending} className="group min-w-0 x-form">
        {children}
      </fieldset>
    </form>
  );
}
