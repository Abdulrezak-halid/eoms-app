import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CProductForm } from "../components/CProductForm";
import { IDtoProductRequest } from "../interfaces/IDtoProduct";

export function CProductAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoProductRequest) => {
      const res = await Api.POST("/u/product-base/product/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/product-base/product");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("product"),
        path: "/product-base/product",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CProductForm onSubmit={handleSubmit} />
    </CBody>
  );
}
