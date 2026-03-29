import { IDtoEPermission } from "common/build-api-schema";
import { useContext, useMemo } from "react";
import { useParams } from "wouter";

import { CCard } from "@m/core/components/CCard";
import { CHighlightedMatchText } from "@m/core/components/CHighlightedMatchText";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CSwitch } from "@m/core/components/CSwitch";

import { ContextSession } from "../contexts/ContextSession";
import { IPermissionInfo } from "../hooks/usePermissionMap";

export function CPermCard({
  info,
  perm,
  userPerms,
  onChange,
  searchQuery,
}: {
  info?: IPermissionInfo | null;
  perm: IDtoEPermission;
  userPerms: IDtoEPermission[];
  onChange: (perm: IDtoEPermission, value: boolean) => void;
  searchQuery?: string;
}) {
  const { session } = useContext(ContextSession);
  const { userId: paramId } = useParams();

  const { checked, disabled } = useMemo(() => {
    const userId = paramId || "";
    const isSelf = userId === session?.userId;

    const isRootActive = userPerms.includes("/");

    const isCoreUser = perm === "/BASE/USER";

    return {
      checked:
        (isSelf && isCoreUser) || userPerms.includes(perm) || isRootActive,

      disabled: (isSelf && isCoreUser) || (perm !== "/" && isRootActive),
    };
  }, [paramId, session, userPerms, perm]);

  return (
    <CCard key={perm} className="p-2">
      <CLine className="justify-between pl-2 space-x-4">
        <div className="grow">
          <div>
            <CHighlightedMatchText
              value={info?.title || perm}
              query={searchQuery}
            />
          </div>
          <div>
            <CMutedText wrap>
              <CHighlightedMatchText
                value={info?.description || ""}
                query={searchQuery}
              />
            </CMutedText>
          </div>
        </div>
        <div className="text-right leading-5 space-x-1 sm:block">
          <div>
            <CSwitch
              selected={checked}
              disabled={disabled}
              value={perm}
              onClick={onChange}
            />
          </div>
        </div>
      </CLine>
    </CCard>
  );
}
