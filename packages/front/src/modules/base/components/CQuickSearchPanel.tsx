import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ContextSession } from "@m/base/contexts/ContextSession";
import { useNavData } from "@m/base/hooks/useNavData";
import { isSessionAllowed } from "@m/base/utils/isSessionAllowed";
import { CInputSearch } from "@m/core/components/CInputSearch";
import { CModal } from "@m/core/components/CModal";
import { CSelectList } from "@m/core/components/CSelectList";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, [contenteditable='true'], [contenteditable='']",
    ),
  );
}

export function CQuickSearchPanel() {
  const { session } = useContext(ContextSession);

  const navigate = useNavigate();

  const { isOpen, setIsOpen } = usePopupState();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const navData = useNavData();

  const accessiblePages = useMemo(
    () =>
      navData
        .flatMap((group) => group.list)
        .filter((item) =>
          isSessionAllowed(session, item.permission, item.orgPlanFeature),
        ),
    [navData, session],
  );

  const normalizedSearch = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery],
  );

  const filteredPages = useMemo(() => {
    if (!normalizedSearch) {
      return accessiblePages;
    }

    return accessiblePages.filter((item) =>
      item.label.toLowerCase().includes(normalizedSearch),
    );
  }, [accessiblePages, normalizedSearch]);

  const selectedPath = filteredPages[activeIndex]?.path;

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const selectPath = useCallback(
    (path: IRoutePath) => {
      navigate(path);
      setIsOpen(false);
    },
    [navigate, setIsOpen],
  );

  const handleListChange = useCallback(
    (path: IRoutePath) => {
      selectPath(path);
    },
    [selectPath],
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Escape") {
        e.preventDefault();
        closePanel();
        return;
      }

      if (e.code === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (filteredPages.length === 0) {
            return 0;
          }
          return Math.min(prev + 1, filteredPages.length - 1);
        });
        return;
      }

      if (e.code === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (e.code === "Enter" && selectedPath) {
        e.preventDefault();
        selectPath(selectedPath);
      }
    },
    [closePanel, filteredPages.length, selectPath, selectedPath],
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setActiveIndex(0);
      return;
    }

    setActiveIndex(0);
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedSearch]);

  useEffect(() => {
    if (activeIndex < filteredPages.length) {
      return;
    }

    if (filteredPages.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(filteredPages.length - 1);
  }, [activeIndex, filteredPages.length]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      if (isOpen) {
        if (e.code !== "Escape") {
          return;
        }

        e.preventDefault();
        closePanel();
        return;
      }

      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

      if (isEditableTarget(e.target)) {
        return;
      }

      e.preventDefault();
      setIsOpen(true);
    };

    window.document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [closePanel, isOpen, setIsOpen]);

  const results = useMemo(
    () =>
      filteredPages.map((item) => ({ value: item.path, label: item.label })),
    [filteredPages],
  );

  if (!isOpen) {
    return null;
  }

  return (
    <CModal onClickBg={closePanel} lg>
      <div className="space-y-3">
        <CInputSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyDown={handleInputKeyDown}
          autoFocus
          noCleanButton
        />

        <CSelectList
          list={results}
          value={selectedPath}
          onChange={handleListChange}
          inline
          className="max-h-96"
        />
      </div>
    </CModal>
  );
}
