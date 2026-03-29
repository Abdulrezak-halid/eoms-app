import { IDtoEPermission } from "common/build-api-schema";
import { Search } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";

import { Api, InferApiGetResponse } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CInputString } from "@m/core/components/CInputString";
import { CLine } from "@m/core/components/CLine";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useBuffer } from "@m/core/hooks/useBuffer";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { IBreadCrumb } from "../components/CBreadCrumbs";
import { CButtonRefresh } from "../components/CButtonRefresh";
import { CPermCard } from "../components/CPermCard";
import { ContextSession } from "../contexts/ContextSession";
import { useApiToast } from "../hooks/useApiToast";
import { usePermissionMap } from "../hooks/usePermissionMap";

export function CUserPermission() {
  const { t } = useTranslation();

  const { userId: paramId } = useParams();
  const userId = paramId || "";

  const fetchPermissions = useCallback(async () => {
    const res = await Api.GET("/u/base/user/permissions/{userId}", {
      params: { path: { userId } },
    });
    return res;
  }, [userId]);

  const [data, reload] = useLoader(fetchPermissions);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("users"),
        path: "/conf/user",
      },
      {
        label: data.payload?.displayName,
        dynamic: true,
      },
      {
        label: t("permissions"),
      },
    ],
    [data.payload?.displayName, t],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [bufferedSearch, bufferedSearchPending] = useBuffer(searchQuery);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <div className="space-y-4">
            <CLine className="grow space-x-2 justify-end">
              <CInputString
                value={searchQuery}
                onChange={setSearchQuery}
                icon={Search}
                placeholder={t("search")}
                className="grow"
              />
              <CButtonRefresh onClick={reload} />
            </CLine>

            <div className={classNames(bufferedSearchPending && "opacity-50")}>
              <CUserPermissionBody payload={payload} filter={bufferedSearch} />
            </div>
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}

export function CUserPermissionBody({
  payload,
  filter,
}: {
  payload: InferApiGetResponse<"/u/base/user/permissions/{userId}">;
  filter: string;
}) {
  const permissionMap = usePermissionMap();

  const { userId: paramId } = useParams();
  const userId = paramId || "";

  const [userPerms, setUserPerms] = useState<IDtoEPermission[]>(
    payload.permissions,
  );

  const { session, setSession } = useContext(ContextSession);

  // Update user context if it is user's own permission
  // TODO move here into fetcher in future,
  //   when permissions are fetched for each update
  useEffect(() => {
    if (userId !== session.userId) {
      return;
    }
    setSession((d) => ({
      ...d,
      permissions: ["/BASE/USER", ...userPerms],
    }));
  }, [userPerms, setSession, session.userId, userId]);

  const apiToast = useApiToast();

  const handleClickSwitch = useCallback(
    async (permission: IDtoEPermission, value: boolean) => {
      const result = await Api.PUT("/u/base/user/permission/{userId}", {
        params: { path: { userId } },
        body: { value, permission },
      });
      apiToast(result);
      if (!result.error) {
        setUserPerms((prev) =>
          value ? [...prev, permission] : prev.filter((p) => p !== permission),
        );
      }
    },
    [userId, apiToast],
  );

  const allPermissions = useMemo(() => {
    const permissions = Object.keys(permissionMap) as IDtoEPermission[];
    return permissions.filter((d) => {
      const info = permissionMap[d];
      // Info may be null, that means it won't be listed.
      if (!info) {
        return false;
      }
      // If info.orgPlanFeatre is not set, that means it should be always listed.
      if (!info.orgPlanFeature) {
        return true;
      }
      // If user organization does not have this feature, do not list.
      if (!session.orgPlan.features) {
        return false;
      }
      return session.orgPlan.features.includes(info.orgPlanFeature);
    });
  }, [permissionMap, session.orgPlan.features]);

  const filteredPermissions = useMemo(() => {
    if (!filter.trim()) {
      return allPermissions;
    }
    const query = filter.toLowerCase();
    return allPermissions.filter((permKey) => {
      const permissionData = permissionMap[permKey];
      return (
        permissionData?.title?.toLowerCase().includes(query) ||
        permissionData?.description.toLowerCase().includes(query)
      );
    });
  }, [filter, allPermissions, permissionMap]);

  return (
    <div className="space-y-2">
      {filteredPermissions.length === 0 ? (
        <CNoRecord className="py-12" />
      ) : (
        filteredPermissions.map((perm) => (
          <CPermCard
            key={perm}
            perm={perm}
            info={permissionMap[perm]}
            userPerms={userPerms}
            onChange={handleClickSwitch}
            searchQuery={filter.trim()}
          />
        ))
      )}
    </div>
  );
}
