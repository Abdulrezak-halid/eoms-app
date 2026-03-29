import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IBreadCrumb } from "../components/CBreadCrumbs";
import { CUserForm } from "../components/CUserForm";
import { IDtoUserRequest } from "../interfaces/IDtoUser";

export function CUserEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/base/user/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("users"),
        path: "/conf/user",
      },
      {
        label:
          `${data.payload?.name || ""} ${data.payload?.surname || ""}`.trim(),
        dynamic: true,
      },
      { label: t("edit") },
    ],
    [t, data.payload?.name, data.payload?.surname],
  );

  const handleSubmit = useCallback(
    async (body: IDtoUserRequest) => {
      const res = await Api.PUT("/u/base/user/item/{id}", {
        params: { path: { id } },
        body: { ...body, password: body.password || undefined },
      });
      apiToast(res);
      if (!res.error) {
        navigate("/conf/user");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CUserForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
