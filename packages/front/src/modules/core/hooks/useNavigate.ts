import { useCallback } from "react";
import { useLocation } from "wouter";

import { IRoutePath } from "../interfaces/IRoutePath";

export function useNavigate() {
  const [, navigate] = useLocation();
  return useCallback(
    (path: IRoutePath) => {
      navigate(path);
    },
    [navigate],
  );
}
