/**
 * @file: CDevLogin.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.11.2024
 * Last Modified Date: 01.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useState } from "react";
import { CircleUser } from "lucide-react";

import { CBody } from "@m/base/components/CBody";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CForm } from "@m/core/components/CForm";
import { CInputPassword } from "@m/core/components/CInputPassword";
import { CInputString } from "@m/core/components/CInputString";
import { CInvalidMsg } from "@m/core/components/CInvalidMsg";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

export function CDevLogin() {
  const inputUsername = useInput("");
  const inputPassword = useInput("");
  const invalid = useInputInvalid(inputUsername, inputPassword);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(async () => {
    setErrorMsg("");
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
    setErrorMsg("Username or password is wrong");
  }, []);

  return (
    <CBody title="Dev - Login">
      <div className="h-full flex justify-center items-center">
        <CForm onSubmit={handleSubmit}>
          <CCard className="w-[24rem] p-4 space-y-4">
            <div className="text-2xl px-4 pt-2">Login</div>
            <CInputString
              icon={CircleUser}
              placeholder="Username"
              {...inputUsername}
            />
            <div>
              <CInputPassword placeholder="Password" {...inputPassword} />
              <CInvalidMsg value={errorMsg} />
            </div>
            <div className="flex justify-end">
              <CButton label="Login" primary disabled={invalid} submit />
            </div>
          </CCard>
        </CForm>
      </div>
    </CBody>
  );
}
