import { PropsWithChildren } from "react";

import { CFixedFormWidth } from "./CFixedFormWidth";
import { CInfoButton } from "./CInfoButton";
import { CInvalidMsg } from "./CInvalidMsg";
import { CLine } from "./CLine";
import { CMutedText } from "./CMutedText";

export function CFormPanel({ children }: PropsWithChildren) {
  return <CFixedFormWidth className="space-y-3">{children}</CFixedFormWidth>;
}

export function CFormLine({
  label,
  children,
  invalidMsg,
  description,
  info,
}: PropsWithChildren<{
  label?: string;
  invalidMsg?: string;
  description?: string;
  info?: string;
}>) {
  return (
    <div className="@sm:flex @sm:space-x-2">
      {label && (
        <div className="@sm:w-40 flex-none py-3 text-gray-600 dark:text-gray-300 font-bold">
          {label}
        </div>
      )}
      {/* min-w-0 to active text ellipsis in components */}
      <div className="grow min-w-0">
        {/* Second flex line is only for info button */}
        <div className="flex space-x-2">
          <div className="grow min-w-0">{children}</div>
          {info && <CInfoButton message={info} />}
        </div>

        <CInvalidMsg value={invalidMsg} />

        {description && (
          <CMutedText className="block py-1" wrap>
            {description}
          </CMutedText>
        )}
      </div>
    </div>
  );
}

export function CFormFooter({ children }: PropsWithChildren) {
  return <CLine className="justify-end space-x-3">{children}</CLine>;
}
