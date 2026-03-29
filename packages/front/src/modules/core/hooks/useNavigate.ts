/**
 * @file: useNavigate.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.04.2025
 * Last Modified Date: 02.04.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
