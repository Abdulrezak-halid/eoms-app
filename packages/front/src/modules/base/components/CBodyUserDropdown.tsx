import {
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useCallback, useContext, useMemo, useState } from "react";
import { CircleUser, LogOut } from "lucide-react";

import { ContextSession } from "@m/base/contexts/ContextSession";
import { useLogout } from "@m/base/hooks/useLogout";
import { CButtonContainer } from "@m/core/components/CButtonContainer";
import { CIcon } from "@m/core/components/CIcon";
import { CSelectList } from "@m/core/components/CSelectList";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CBodyUserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [flip(), offset(4), shift()],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const { t } = useTranslation();
  const { session } = useContext(ContextSession);

  const userDropdownList = useMemo(
    () => [
      {
        icon: CircleUser,
        label: session.userDisplayName, // t("myProfile"),
        value: "MY_PROFILE" as const,
      },
      {
        icon: LogOut,
        label: t("logout"),
        value: "LOGOUT" as const,
      },
    ],
    [t, session.userDisplayName],
  );

  const navigate = useNavigate();

  const logout = useLogout();
  const handleUserDropdown = useCallback(
    (value: (typeof userDropdownList)[number]["value"]) => {
      switch (value) {
        case "MY_PROFILE": {
          navigate("/my-profile");
          return;
        }
        case "LOGOUT": {
          logout();
          return;
        }
      }
    },
    [navigate, logout],
  );

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        type="button"
        {...getReferenceProps()}
        className="group outline-hidden text-left align-middle"
        title={`${session.userDisplayName}\n${session.orgDisplayName}`}
      >
        <CButtonContainer tertiary>
          <div className="flex justify-center items-center px-3 h-12">
            <CIcon value={CircleUser} />
            <div className="text-nowrap px-1 ml-1 hidden @md:block">
              <div className="font-bold">{session.userDisplayName}</div>
              <div className="text-xs -mt-1">{session.orgDisplayName}</div>
            </div>
          </div>
        </CButtonContainer>
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          className="z-20"
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <CSelectList list={userDropdownList} onChange={handleUserDropdown} />
        </div>
      )}
    </div>
  );
}
