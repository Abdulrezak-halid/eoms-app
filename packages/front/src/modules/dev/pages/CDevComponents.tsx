import { Link, Star, UserCircle, X } from "lucide-react";
import { House, KeyRound } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { CBadgeEmail } from "@m/base/components/CBadgeEmail";
import { CBadgePhone } from "@m/base/components/CBadgePhone";
import { CBadgeUrl } from "@m/base/components/CBadgeUrl";
import { CBody } from "@m/base/components/CBody";
import { CComboboxTimezone } from "@m/base/components/CComboboxTimezone";
import { CGrid } from "@m/base/components/CGrid";
import { CPagination } from "@m/base/components/CPagination";
import { CBadge } from "@m/core/components/CBadge";
import { CBadgeContainer } from "@m/core/components/CBadgeContainer";
import { CBadgePercentage } from "@m/core/components/CBadgePercentage";
import { CButton } from "@m/core/components/CButton";
import { CButtonContainer } from "@m/core/components/CButtonContainer";
import { CCard } from "@m/core/components/CCard";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CCombobox } from "@m/core/components/CCombobox";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import {
  CDropdown,
  IDropdownListCallback,
  IDropdownListItem,
} from "@m/core/components/CDropdown";
import { CExternalLink } from "@m/core/components/CExternalLink";
import { CFixedFormWidth } from "@m/core/components/CFixedFormWidth";
import { CFlag } from "@m/core/components/CFlag";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CHighlightedMatchText } from "@m/core/components/CHighlightedMatchText";
import { CHr } from "@m/core/components/CHr";
import { CIcon } from "@m/core/components/CIcon";
import { CInfoButton } from "@m/core/components/CInfoButton";
import { CInputContainer } from "@m/core/components/CInputContainer";
import { CInputCore } from "@m/core/components/CInputCore";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputDatetime } from "@m/core/components/CInputDatetime";
import { CInputEmail } from "@m/core/components/CInputEmail";
import { CInputFile } from "@m/core/components/CInputFile";
import { CInputImage } from "@m/core/components/CInputImage";
import { CInputJson } from "@m/core/components/CInputJson";
import { CInputMultiPhone } from "@m/core/components/CInputMultiPhone";
import { CInputMultiString } from "@m/core/components/CInputMultiString";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputPassword } from "@m/core/components/CInputPassword";
import { CInputPhone } from "@m/core/components/CInputPhone";
import { CInputPopup } from "@m/core/components/CInputPopup";
import { CInputString } from "@m/core/components/CInputString";
import { CInputStringWithList } from "@m/core/components/CInputStringWithList";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { CInputTime } from "@m/core/components/CInputTime";
import { CInputUrl } from "@m/core/components/CInputUrl";
import { CInvalidMsg } from "@m/core/components/CInvalidMsg";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CLoading } from "@m/core/components/CLoading";
import { CMaintenance } from "@m/core/components/CMaintenance";
import { CMessageCard } from "@m/core/components/CMessageCard";
import { CMultiSelect } from "@m/core/components/CMultiSelect";
import { CMultiSelectList } from "@m/core/components/CMultiSelectList";
import { CMutedText } from "@m/core/components/CMutedText";
import { CNoPermission } from "@m/core/components/CNoPermission";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { CNotFound } from "@m/core/components/CNotFound";
import { CPlanDisabledOp } from "@m/core/components/CPlanDisabledOp";
import { CPopupPanel } from "@m/core/components/CPopupPanel";
import {
  CQuickRangeSelect,
  ICQuickDateRangeValue,
  ICQuickRangeValue,
} from "@m/core/components/CQuickRangeSelect";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { CSelectDate } from "@m/core/components/CSelectDate";
import { CSelectDatetime } from "@m/core/components/CSelectDatetime";
import { CSelectList, ISelectListItem } from "@m/core/components/CSelectList";
import { CSelectTime } from "@m/core/components/CSelectTime";
import { CSlider } from "@m/core/components/CSlider";
import { CSomethingWentWrong } from "@m/core/components/CSomethingWentWrong";
import { CSpinner } from "@m/core/components/CSpinner";
import { CSwitch } from "@m/core/components/CSwitch";
import { CTab, ITabListPathItem } from "@m/core/components/CTab";
import { CTimeout } from "@m/core/components/CTimeout";
import { useBuffer } from "@m/core/hooks/useBuffer";
import { usePopupState } from "@m/core/hooks/usePopupState";
import { classNames } from "@m/core/utils/classNames";
import { CInputMultiDomainIp } from "@m/sys/components/CInputMultiDomainIp";

import { CDevComponentLine, CDevComponentPanel } from "./CDevComponentPanel";

export function CDevComponents() {
  const list = useMemo(
    () => [
      {
        label: "Label 1",
        value: 1,
      },
      {
        label: "Label 2",
        value: 2,
      },
    ],
    [],
  );
  const listEmpty = useMemo(() => [], []);

  const listValues = useMemo(() => [1], []);

  const listWithDisabledAndIcon = useMemo(
    () => [
      {
        icon: Star,
        label: "An Item",
        value: 1,
      },
      {
        icon: <CFlag value="tr" />,
        label: "Custom Icon",
        value: 2,
      },
      {
        label: "Another Item",
        value: 3,
      },
      {
        icon: UserCircle,
        label: "Disabled Item",
        value: 4,
        disabled: true,
      },
    ],
    [],
  );

  const listLongWithIcons = useMemo(
    () => [
      {
        icon: Star,
        label: "An Item",
        value: 1,
      },
      {
        icon: UserCircle,
        label: "Another Item",
        value: 2,
      },
      {
        label: "Item",
        value: 3,
      },
      {
        label: "Another Item",
        value: 4,
      },
      {
        label: "Another Item",
        value: 5,
      },
    ],
    [],
  );

  const listWithPath = useMemo<ISelectListItem<number>[]>(
    () => [
      {
        label: "Regular option",
        value: 1,
      },
      {
        icon: Link,
        label: "Option with path",
        value: -1,
        path: "/",
      },
    ],
    [],
  );

  const listString = useMemo(() => ["a value", "another value"], []);
  const listStringLong = useMemo(
    () => [
      "a value",
      "another value",
      "a value",
      "another value",
      "a value",
      "another value",
      "a value",
      "another value",
      "a value",
      "another value",
      "a value",
      "another value",
    ],
    [],
  );

  const [idsState, setIdsState] = useState(() => [1, 2, 3, 4, 5]);

  const [strState, setStrState] = useState("value");
  const [strStateEmpty, setStrStateEmpty] = useState("");
  const [listState, setListState] = useState<number | undefined>(1);
  const [listMultiState, setListMultiState] = useState<number[]>();
  const [listStateEmpty, setListStateEmpty] = useState<number>();
  const [boolState, setBoolState] = useState(false);
  const [dateState, setDateState] = useState<string | undefined>("2024-10-17");
  const [dateStateEmpty, setDateStateEmpty] = useState<string>();
  const [numberState, setNumberState] = useState<number | undefined>(0);
  const [numberStateEmpty, setNumberStateEmpty] = useState<number>();
  const [floatState, setFloatState] = useState<number | undefined>(0);
  const [timeStateEmpty, setTimeStateEmpty] = useState<string>();
  const [timeStateEmptyStr, setTimeStateEmptyStr] = useState("");
  const [timeState, setTimeState] = useState("01:02:03");
  const [timeStateNoSeconds, setTimeStateNoSeconds] = useState("10:10");
  const [timezoneState, setTimezoneState] = useState<string>();

  const [datetimeStateEmpty, setDatetimeStateEmpty] = useState<string>();
  const [datetimeStateEmptyStr, setDatetimeStateEmptyStr] = useState<
    string | undefined
  >("");
  const [datetimeState, setDatetimeState] = useState<string | undefined>(
    "2024-10-17T05:00:00Z",
  );

  const [quickRangeState, setQuickRangeState] = useState<ICQuickRangeValue>({
    quickRange: "LAST_7_DAYS",
  });
  const [quickDateRangeState, setQuickDateRangeState] =
    useState<ICQuickDateRangeValue>({ quickRange: "THIS_MONTH" });

  const [fileState, setFileState] = useState<File[]>(() => {
    return [new File(["content"], "filename.txt")];
  });
  const [fileStateEmpty, setFileStateEmpty] = useState<File[]>();

  const [fileImageState, setFileImageState] = useState<File | null>(null);

  const [jsonState, setJsonState] = useState<unknown>({
    fieldString: "value",
    fieldNumber: 10,
    fieldObject: {
      subField: null,
    },
    fieldArray: [1, 2, 3],
  });

  const [strArrState, setStrArrState] = useState<string[]>();
  const [strArrStateFilled, setStrArrStateFilled] = useState<string[]>(() => [
    "val1",
    "val2",
  ]);
  const [strArrStateNoUnique, setStrArrStateNoUnique] = useState(() => [
    "val0",
    "val0",
  ]);

  const setListStateAsync = useCallback(async (value: number | undefined) => {
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
    setListState(value);
  }, []);

  const setBoolStateAsync = useCallback(async (value: boolean) => {
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
    setBoolState(value);
  }, []);

  const setBoolStateAsync2 = useCallback(async (value: boolean) => {
    setBoolState(value);
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
  }, []);

  const toggleBoolState = useCallback(() => {
    setBoolState((d) => !d);
  }, []);

  const asyncCb = useCallback(async () => {
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
  }, []);

  const inputPopupState1 = usePopupState();
  const inputPopupState2 = usePopupState();
  const inputPopupState3 = usePopupState();

  const [bufferedStr, bufferedPending] = useBuffer(strState);

  const [currentPage, setCurrentPage] = useState(1);

  const listDropdown = useMemo<IDropdownListItem<number>[]>(
    () => [
      {
        icon: Star,
        label: "Item 1 Async Cb",
        onClick: async (v?: number) => {
          await new Promise((res) => {
            setTimeout(res, 1000);
          });
          alert(`Item 1 Value: ${v}`);
        },
      },
      {
        icon: <CFlag value="tr" />,
        label: "Item 2 Custom icon",
        onClick: (v?: number) => {
          alert(`Item 2 Value: ${v}`);
        },
      },
      {
        icon: Star,
        label: "Item 3 Cb",
        onClick: (v?: number) => {
          alert(`Item 3 Value: ${v}`);
        },
      },
      {
        icon: Star,
        label: "Item 4 Path",
        path: "/",
      },
    ],
    [],
  );

  const listDropdownWithDisabled = useMemo<IDropdownListItem<number>[]>(
    () => listDropdown.map((d) => ({ ...d, disabled: true })),
    [listDropdown],
  );

  const listDropdownCb = useCallback<IDropdownListCallback<number>>(
    (d) => [
      {
        icon: Star,
        label: `Item 1 - Value ${d}`,
      },
      {
        icon: Star,
        label: `Item 2 Cb - Value ${d}`,
        onClick: () => {
          alert(`Item 2 Value: ${d}`);
        },
      },
    ],
    [],
  );

  const regex = useMemo(() => /^.{3}$/, []);

  const popupComponent = useCallback(
    () => <CPopupPanel>Content</CPopupPanel>,
    [],
  );

  const tabList = useMemo<ITabListPathItem[]>(
    () => [
      { label: "Components", path: "/dev/components" },
      { label: "Special Components", path: "/dev/component-doc-special" },
      { label: "Form", path: "/dev/form" },
    ],
    [],
  );

  const tabListWithComponents = useMemo<ITabListPathItem[]>(
    () => [
      {
        label: "Components",
        path: "/dev/components",
        component: <CCard>Components</CCard>,
      },
      {
        label: "Special Components",
        path: "/dev/component-doc-special",
        component: <CCard>Com Doc</CCard>,
      },
      { label: "Form", path: "/dev/form", component: <CCard>Form</CCard> },
    ],
    [],
  );

  return (
    <CBody title="Dev - Component">
      <CDevComponentPanel>
        <CDevComponentLine label="CIcon">
          <CLine>
            <CIcon value={Star} />
            <CIcon value={X} />
            <CIcon value={Star} sm />
            <CIcon value={Star} />
            <CIcon value={Star} lg />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CFlag">
          sm
          <CLine className="space-x-2">
            <CFlag value="tr" sm />
            <CFlag value="us" sm />
            <CFlag value="gb" sm />
            <CFlag value="ro" sm />
          </CLine>
          default
          <CLine className="space-x-2">
            <CFlag value="tr" />
            <CFlag value="us" />
            <CFlag value="gb" />
            <CFlag value="ro" />
          </CLine>
          lg
          <CLine className="space-x-2">
            <CFlag value="tr" lg />
            <CFlag value="us" lg />
            <CFlag value="gb" lg />
            <CFlag value="ro" lg />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CLine">
          <CLine>
            <div>One</div>
            <div>
              Another
              <br />
              One
            </div>
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CButtonContainer">
          <CButtonContainer>
            Content
            <br />
            Content
          </CButtonContainer>
        </CDevComponentLine>

        <CDevComponentLine label="CInputContainer">
          <CInputContainer>
            Content
            <br />
            Content
          </CInputContainer>
        </CDevComponentLine>

        <CDevComponentLine label="CInputCore">
          <CInputCore placeholder="Input Core" />
        </CDevComponentLine>

        <CDevComponentLine label="CPopupPanel">
          <CPopupPanel>
            Content
            <br />
            Content
          </CPopupPanel>
        </CDevComponentLine>

        <CDevComponentLine label="CGrid">
          <CGrid>
            {new Array(10).fill(null).map((_, i) => (
              <CCard key={i} className="px-10 py-4">
                #{i}
              </CCard>
            ))}
          </CGrid>
        </CDevComponentLine>

        <CDevComponentLine label="CBadge">
          <div className="space-x-2">
            <CBadge icon={Star} />
            <CBadge value="Badge" />
            <CBadge icon={Star} value="Badge" />
          </div>
        </CDevComponentLine>

        <CDevComponentLine label="CBadge - inline">
          <CLine>Text</CLine>
          <CLine>Text</CLine>
          <CLine>
            Text
            <CBadge value="Inline" inline />
          </CLine>
          <CLine>
            Text
            <CBadge icon={Star} value="Inline" inline />
          </CLine>
          <CLine>
            Text
            <CBadge icon={Star} inline />
          </CLine>
          <CLine>
            Text
            <CBadge value="Not Inline" />
          </CLine>
          <CLine>
            Text
            <CBadge icon={Star} value="Not Inline" />
          </CLine>
          <CLine>
            Text
            <CBadge icon={Star} />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CBadgeContainer">
          <CBadgeContainer>
            <div>Child Component</div>
          </CBadgeContainer>
        </CDevComponentLine>

        <CDevComponentLine label="CBadgeEmail">
          <CBadgeEmail value="mail@example.com" />
        </CDevComponentLine>

        <CDevComponentLine label="CBadgePhone">
          <CBadgePhone value="+901234567890" />
        </CDevComponentLine>

        <CDevComponentLine label="CBadgeUrl">
          <CBadgeUrl value="https://example.com" />
        </CDevComponentLine>

        <CDevComponentLine label="CGridBadge">
          <CGridBadge>
            <CBadge value="A badge" />
            <CBadge value="Another badge" />
            <CBadge value="Another another badge" />
            <CBadge value="A badge" />
            <CBadge value="Another badge" />
            <CBadge value="Another another badge" />
            <CBadge value="A badge" />
            <CBadge value="Another badge" />
            <CBadge value="Another another badge" />
          </CGridBadge>
        </CDevComponentLine>

        <CDevComponentLine label="CHighlightedMatchText">
          <CHighlightedMatchText value="test1 test2 test1" query="test1" />
        </CDevComponentLine>

        <CDevComponentLine label="CFixedFormWidth">
          <CFixedFormWidth className="space-y-2">
            <div>Fixed width container for form like pages</div>
            <CCard className="p-3">Card</CCard>
            <CInputString placeholder="Input" />
          </CFixedFormWidth>
        </CDevComponentLine>

        <CDevComponentLine label="CPagination">
          <CPagination
            totalRecordCount={100}
            pageRecordCount={5}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCard">
          <CCard>
            Content
            <br />
            Content
          </CCard>
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - warning (default)">
          <CMessageCard message="Message" type="warning" />
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - info">
          <CMessageCard message="Message" type="info" />
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - error">
          <CMessageCard message="Message" type="error" />
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - success">
          <CMessageCard message="Message" type="success" />
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - warning - goto">
          <CMessageCard
            message="Message"
            type="warning"
            goLabel="Go Home"
            goPath="/"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - info - goto">
          <CMessageCard
            message="Message"
            type="info"
            goLabel="Go Home"
            goPath="/"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - error - goto">
          <CMessageCard
            message="Message"
            type="error"
            goLabel="Go Home"
            goPath="/"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMessageCard - success - goto">
          <CMessageCard
            message="Message"
            type="success"
            goLabel="Go Home"
            goPath="/"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPopup">
          <CInputPopup
            state={inputPopupState1}
            popupComponent={popupComponent}
            caretIcon={Star}
            placeholder="Placeholder"
          >
            Content
          </CInputPopup>
        </CDevComponentLine>

        <CDevComponentLine label="CInputPopup - icon">
          <CInputPopup
            state={inputPopupState2}
            popupComponent={popupComponent}
            icon={Star}
            caretIcon={Star}
            placeholder="Placeholder"
          >
            Content
          </CInputPopup>
        </CDevComponentLine>

        <CDevComponentLine label="CInputPopup - placeholder">
          <CInputPopup
            state={inputPopupState3}
            popupComponent={popupComponent}
            icon={Star}
            caretIcon={Star}
            placeholder="Placeholder"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMutedText">
          <CMutedText value="Content" />
        </CDevComponentLine>

        <CDevComponentLine label="CInvalidMsg">
          <CInvalidMsg value="Content" />
        </CDevComponentLine>

        <CDevComponentLine label="CInvalidMsg - multiple">
          <CInvalidMsg value={boolState ? undefined : listStringLong} />
          <CButton label="Toogle" onClick={toggleBoolState} />
        </CDevComponentLine>

        <CDevComponentLine label="CNoRecord">
          <CNoRecord />
        </CDevComponentLine>

        <CDevComponentLine label="CNotFound">
          <CNotFound />
        </CDevComponentLine>

        <CDevComponentLine label="CNoPermission">
          <CNoPermission />
        </CDevComponentLine>

        <CDevComponentLine label="CPlanDisabledOp">
          <CPlanDisabledOp />
        </CDevComponentLine>

        <CDevComponentLine label="CMaintenance">
          <CMaintenance />
        </CDevComponentLine>

        <CDevComponentLine label="CTimeout">
          <CTimeout />
        </CDevComponentLine>

        <CDevComponentLine label="CSomethingWentWrong">
          <CSomethingWentWrong />
        </CDevComponentLine>

        <CDevComponentLine label="CLoading">
          <CLoading />
        </CDevComponentLine>

        <CDevComponentLine label="CSpinner">
          <CLine className="space-x-2">
            <CSpinner />
            <CSpinner lg />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CHr">
          <CHr />
        </CDevComponentLine>

        <CDevComponentLine label="CBadgePercentage">
          <CBadgePercentage value={10.1111111} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayNumber">
          <CDisplayNumber value={46.788} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayNumber - high precision">
          <CDisplayNumber value={51.5303074102915} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayNumber - integer">
          <CDisplayNumber value={120} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayNumber - with unit">
          <CDisplayNumber value={120} unitStr="unit" />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayNumber - min decimals">
          <CDisplayNumber value={120} minDecimals={2} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayNumber - min decimals with float">
          <CDisplayNumber value={10.1} minDecimals={2} />
        </CDevComponentLine>

        <CDevComponentLine label="CDisplayNumber - empty value">
          <CDisplayNumber value={undefined} />
        </CDevComponentLine>

        <CDevComponentLine label="useBuffer">
          <CInputString value={strState} onChange={setStrState} />
          <div className={classNames(bufferedPending && "opacity-50")}>
            {bufferedStr}
          </div>
        </CDevComponentLine>

        <CDevComponentLine label="CTab">
          <CTab list={tabList} />
        </CDevComponentLine>

        <CDevComponentLine label="CTab - with components">
          <CTab list={tabListWithComponents} />
        </CDevComponentLine>

        <CDevComponentLine label="CButton - empty">
          <CButton onClick={asyncCb} />
        </CDevComponentLine>

        <CDevComponentLine label="CButton - default">
          <CLine className="space-x-2">
            <CButton icon={Star} onClick={asyncCb} />
            <CButton label="Button" onClick={asyncCb} />
            <CButton icon={Star} label="Button" onClick={asyncCb} />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CButton - primary">
          <CLine className="space-x-2">
            <CButton icon={Star} onClick={asyncCb} primary />
            <CButton label="Button" onClick={asyncCb} primary />
            <CButton icon={Star} label="Button" onClick={asyncCb} primary />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CButton - tertiary">
          <CLine className="space-x-2">
            <CButton icon={Star} onClick={asyncCb} tertiary />
            <CButton label="Button" onClick={asyncCb} tertiary />
            <CButton icon={Star} label="Button" onClick={asyncCb} tertiary />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CButton - red">
          <CLine className="space-x-2">
            <CButton icon={Star} label="Button" onClick={asyncCb} color="red" />
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="red"
              primary
            />
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="red"
              tertiary
            />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CButton - orange">
          <CLine className="space-x-2">
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="orange"
            />
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="orange"
              primary
            />
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="orange"
              tertiary
            />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CButton - blue">
          <CLine className="space-x-2">
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="blue"
            />
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="blue"
              primary
            />
            <CButton
              icon={Star}
              label="Button"
              onClick={asyncCb}
              color="blue"
              tertiary
            />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CButton - iconRight">
          <CButton iconRight={Star} label="Button" onClick={asyncCb} />
        </CDevComponentLine>

        <CDevComponentLine label="CLink - default">
          <CLine className="space-x-2">
            <CLink icon={House} path="/" />
            <CLink label="Home" path="/" />
            <CLink icon={House} label="Home" path="/" />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CLink - iconRight">
          <CLink iconRight={House} label="Home" path="/" />
        </CDevComponentLine>

        <CDevComponentLine label="CLink - disabled">
          <CLink icon={House} label="Home" path="/" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CLink - no path">
          <CLink icon={House} label="Home" />
        </CDevComponentLine>

        <CDevComponentLine label="CExternalLink - default">
          <CLine className="space-x-2">
            <CExternalLink href="https://google.com" />
            <CExternalLink label="Google" href="https://google.com" />
            <CExternalLink
              icon={House}
              label="Google"
              href="https://google.com"
            />
            <CExternalLink
              iconRight={House}
              label="Google"
              href="https://google.com"
            />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CExternalLink - disabled">
          <CExternalLink label="Google" href="https://google.com" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CExternalLink - no href">
          <CExternalLink label="No Link" />
        </CDevComponentLine>

        <CDevComponentLine label="CInfoButton - basic">
          <CInfoButton>
            This is a simple informational message inside the popup.
          </CInfoButton>
        </CDevComponentLine>

        <CDevComponentLine label="CInfoButton - with label">
          <CInfoButton label="More Details">
            This is a simple informational message inside the popup.
          </CInfoButton>
        </CDevComponentLine>

        <CDevComponentLine label="CInfoButton - with child component">
          <CInfoButton label="Help">
            <h4 className="font-bold mb-2">How to use this feature</h4>
            <p>You can include rich content like:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Headings and paragraphs</li>
              <li>Formatted lists</li>
              <li>Even other components</li>
            </ul>
          </CInfoButton>
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown">
          <CDropdown label="Dropdown" list={listDropdown} value={1} />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - icon">
          <CDropdown
            icon={Star}
            label="Dropdown"
            list={listDropdown}
            value={1}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - without label">
          <CDropdown list={listDropdown} value={1} />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - callback list">
          <CDropdown label="Dropdown" list={listDropdownCb} value={2} />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - tertiary">
          <CDropdown label="Dropdown" list={listDropdown} value={1} tertiary />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - no right icon">
          <CDropdown
            label="Dropdown"
            list={listDropdown}
            value={1}
            noIconRight
          />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - selected item">
          <CDropdown
            label="Dropdown"
            list={listDropdown}
            value={1}
            selectedItem={listDropdown[0]}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - with disabled items">
          <CDropdown
            label="Dropdown"
            list={listDropdownWithDisabled}
            value={1}
            selectedItem={listDropdownWithDisabled[0]}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CDropdown - disabled">
          <CDropdown label="Dropdown" list={listDropdown} value={1} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString">
          <CInputString value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - icon">
          <CInputString icon={Star} value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - placeholder">
          <CInputString placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - icon placeholder">
          <CInputString icon={Star} placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - placeholder password">
          <CInputString
            value={strState}
            onChange={setStrState}
            type="password"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - children">
          <CInputString
            value={strState}
            onChange={setStrState}
            className="flex items-center"
          >
            <div className="text-nowrap px-2">Right Comp</div>
          </CInputString>
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - regex">
          <CInputString
            placeholder="Placeholder"
            value={strState}
            onChange={setStrState}
            regex={regex}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - noCleanButton">
          <CInputString
            placeholder="Placeholder"
            value={strState}
            onChange={setStrState}
            noCleanButton
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputStringWithList">
          <CInputStringWithList
            list={listString}
            value={strState}
            onChange={setStrState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea">
          <CInputTextarea value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea - icon">
          <CInputTextarea icon={Star} value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea - placeholder">
          <CInputTextarea placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea - noCleanButton">
          <CInputTextarea
            value={strState}
            onChange={setStrState}
            noCleanButton
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword">
          <CInputPassword value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword - icon">
          <CInputPassword
            icon={KeyRound}
            value={strState}
            onChange={setStrState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword - placeholder">
          <CInputPassword placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputEmail">
          <CInputEmail value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputUrl">
          <CInputUrl value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPhone">
          <CInputPhone value={strState} onChange={setStrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiPhone">
          <CInputMultiPhone value={strArrState} onChange={setStrArrState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiDomainIp - domain">
          <CInputMultiDomainIp
            type="domain"
            value={strArrState}
            onChange={setStrArrState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiDomainIp - ip">
          <CInputMultiDomainIp
            type="ip"
            value={strArrState}
            onChange={setStrArrState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber">
          <CInputNumber value={numberState} onChange={setNumberState} />
          {numberState}
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - min max">
          <CInputNumber
            value={numberState}
            onChange={setNumberState}
            min={3}
            max={5}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - step 10">
          <CInputNumber
            value={numberState}
            onChange={setNumberState}
            step={10}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - icon">
          <CInputNumber
            icon={Star}
            value={numberState}
            onChange={setNumberState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - placeholder">
          <CInputNumber placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - float">
          <CInputNumber value={floatState} onChange={setFloatState} float />
          {floatState}
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - float step 0.1">
          <CInputNumber
            value={floatState}
            onChange={setFloatState}
            float
            step={0.1}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputJson">
          <CInputJson value={jsonState} onChange={setJsonState} />
        </CDevComponentLine>

        <CDevComponentLine label="CSlider">
          <CSlider value={numberState} onChange={setNumberState} />
          {numberState}
        </CDevComponentLine>

        <CDevComponentLine label="CSelectList">
          <CSelectList list={list} value={listState} onChange={setListState} />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectList - no value">
          <CSelectList list={list} />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectList - empty">
          <CSelectList list={listEmpty} />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectList - with disabled and icon">
          <CSelectList
            list={listWithDisabledAndIcon}
            value={listState}
            onChange={setListState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectList - with disabled and icon - selected disabled">
          <CSelectList list={listWithDisabledAndIcon} value={3} />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectList - with path option">
          <CSelectList list={listWithPath} value={3} />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectList - multi select">
          <CMultiSelectList
            list={listLongWithIcons}
            value={listMultiState}
            onChange={setListMultiState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox">
          <CCombobox list={list} value={listState} onChange={setListState} />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - async change">
          <CCombobox
            list={list}
            value={listState}
            onChange={setListStateAsync}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - icon">
          <CCombobox
            icon={Star}
            list={list}
            value={listState}
            onChange={setListState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - options with icon">
          <CCombobox
            list={listWithDisabledAndIcon}
            value={listState}
            onChange={setListState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - icon + options with icon">
          <CCombobox
            icon={Star}
            list={listWithDisabledAndIcon}
            value={listState}
            onChange={setListState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - empty">
          <CCombobox list={listEmpty} />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - placeholder">
          <CCombobox list={list} placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - icon placeholder">
          <CCombobox icon={Star} list={list} placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - with disabled values">
          <CCombobox
            list={list}
            value={listState}
            onChange={setListState}
            disabledValues={listValues}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - with enabled values">
          <CCombobox
            list={list}
            value={listState}
            onChange={setListState}
            enabledValues={listValues}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CComboboxTimezone">
          <CComboboxTimezone
            value={timezoneState}
            onChange={setTimezoneState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrState}
            onChange={setStrArrState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - icon">
          <CInputMultiString
            placeholder="Input Multi String"
            icon={Star}
            value={strArrState}
            onChange={setStrArrState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - filled">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrStateFilled}
            onChange={setStrArrStateFilled}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - no unique filled">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrStateNoUnique}
            onChange={setStrArrStateNoUnique}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - regex">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrState}
            onChange={setStrArrState}
            regex={regex}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            value={listMultiState}
            onChange={setListMultiState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - with disabled values">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            value={listMultiState}
            onChange={setListMultiState}
            disabledValues={listValues}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - icon">
          <CMultiSelect
            icon={Star}
            placeholder="Multi Select"
            list={listLongWithIcons}
            value={listMultiState}
            onChange={setListMultiState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - filled">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            value={idsState}
            onChange={setIdsState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox">
          <CCheckbox selected={boolState} onChange={setBoolState} />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - label">
          <CCheckbox
            selected={boolState}
            onChange={setBoolState}
            label="Label"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - checked">
          <CCheckbox selected />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - semiSelected">
          <CCheckbox semiSelected />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - checked label invalid">
          <CCheckbox selected invalid label="Invalid" />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - radio">
          <CCheckbox radio selected={boolState} onChange={setBoolState} />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - radio - label">
          <CCheckbox
            radio
            selected={boolState}
            onChange={setBoolState}
            label="Label"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - radio - checked">
          <CCheckbox radio selected={true} />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - radio checked label invalid">
          <CCheckbox radio selected invalid label="Invalid" />
        </CDevComponentLine>

        <CDevComponentLine label="CRadioGroup">
          <CRadioGroup list={list} value={listState} onChange={setListState} />
        </CDevComponentLine>

        <CDevComponentLine label="CRadioGroup - empty">
          <CRadioGroup value={undefined} list={listEmpty} />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch">
          <CSwitch selected={boolState} onChange={setBoolState} />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch - async">
          <CSwitch selected={boolState} onChange={setBoolStateAsync} />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch - async 2">
          <CSwitch selected={boolState} onChange={setBoolStateAsync2} />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch - icon">
          <CSwitch
            selected={boolState}
            onChange={setBoolState}
            iconOff={Star}
            iconOn={X}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch - checked">
          <CSwitch selected={true} />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch - label">
          <CSwitch selected={boolState} onChange={setBoolState} label="Label" />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDate - empty">
          <CSelectDate />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDate">
          <CSelectDate value={dateState} onChange={setDateState} />
          {dateState}
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDate - sundayFirst">
          <CSelectDate value={dateState} onChange={setDateState} sundayFirst />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDate - extra row">
          <CSelectDate value="2024-12-12" />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDate - min max">
          <CSelectDate
            value={dateState}
            onChange={setDateState}
            min="2024-10-04"
            max="2024-10-10"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDate - noClear">
          <CSelectDate value={dateState} onChange={setDateState} noClear />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate">
          <CInputDate value={dateState} onChange={setDateState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - icon">
          <CInputDate icon={Star} value={dateState} onChange={setDateState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - placeholder">
          <CInputDate placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - placeholder - empty string value">
          <CInputDate placeholder="Placeholder" value="" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - icon placeholder">
          <CInputDate icon={Star} placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectTime">
          <CSelectTime value={timeState} onChange={setTimeState} />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectTime - empty">
          <CSelectTime value={timeStateEmpty} onChange={setTimeStateEmpty} />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectTime - empty string">
          <CSelectTime
            value={timeStateEmptyStr}
            onChange={setTimeStateEmptyStr}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectTime - value no seconds">
          <CSelectTime
            value={timeStateNoSeconds}
            onChange={setTimeStateNoSeconds}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectTime - min max">
          <CSelectTime
            value={timeState}
            onChange={setTimeState}
            min="10:10:10"
            max="11:11:11"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectTime - with seconds">
          <CSelectTime value={timeState} onChange={setTimeState} withSeconds />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime">
          <CInputTime value={timeState} onChange={setTimeState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - placeholder - empty">
          <CInputTime
            value={timeStateEmpty}
            onChange={setTimeStateEmpty}
            placeholder="Placeholder"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - placeholder - empty string">
          <CInputTime
            value={timeStateEmptyStr}
            onChange={setTimeStateEmptyStr}
            placeholder="Placeholder"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - value no seconds">
          <CInputTime
            value={timeStateNoSeconds}
            onChange={setTimeStateNoSeconds}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - min max">
          <CInputTime
            value={timeState}
            onChange={setTimeState}
            min="10:10:10"
            max="11:11:11"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDatetime">
          <CSelectDatetime value={datetimeState} onChange={setDatetimeState} />
          {datetimeState}
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDatetime - empty">
          <CSelectDatetime
            value={datetimeStateEmpty}
            onChange={setDatetimeStateEmpty}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSelectDatetime - min max">
          <CSelectDatetime
            value={datetimeState}
            onChange={setDatetimeState}
            min="2024-10-17T05:00:00Z"
            max="2024-10-18T06:00:00Z"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime">
          <CInputDatetime value={datetimeState} onChange={setDatetimeState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - icon">
          <CInputDatetime
            icon={Star}
            value={datetimeState}
            onChange={setDatetimeState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - placeholder">
          <CInputDatetime placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - placeholder - empty string value">
          <CInputDatetime placeholder="Placeholder" value="" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - icon placeholder">
          <CInputDatetime icon={Star} placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - min max">
          <CInputDatetime
            value={datetimeState}
            onChange={setDatetimeState}
            min="2024-10-17T05:00:00Z"
            max="2024-10-18T06:00:00Z"
          />
        </CDevComponentLine>

        <CDevComponentLine label="CQuickRangeSelect - default - datetime">
          <CQuickRangeSelect
            value={quickRangeState}
            onChange={setQuickRangeState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CQuickRangeSelect - dateOnly">
          <CQuickRangeSelect
            mode="dateOnly"
            value={quickDateRangeState}
            onChange={setQuickDateRangeState}
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile">
          <CInputFile value={fileStateEmpty} onChange={setFileStateEmpty} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile - preselected">
          <CInputFile value={fileState} onChange={setFileState} />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile - multiple">
          <CInputFile
            value={fileStateEmpty}
            onChange={setFileStateEmpty}
            multiple
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile - multiple preselected">
          <CInputFile value={fileState} onChange={setFileState} multiple />
        </CDevComponentLine>

        <CDevComponentLine label="CInputImage">
          <CInputImage
            value={fileImageState}
            onChange={setFileImageState}
            accept="image/*"
            maxSize={2 * 1024 * 1024} // 2MB
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CButton - disabled">
          <CButton icon={Star} label="Button" onClick={asyncCb} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CButton - disabled primary">
          <CButton
            icon={Star}
            label="Button"
            onClick={asyncCb}
            disabled
            primary
          />
        </CDevComponentLine>

        <CDevComponentLine label="CButton - disabled tertiary">
          <CButton
            icon={Star}
            label="Button"
            onClick={asyncCb}
            disabled
            tertiary
          />
        </CDevComponentLine>

        <CDevComponentLine label="CLink - disabled">
          <CLine>
            <CLink icon={Star} label="Button" path="/" disabled />
          </CLine>
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - disabled">
          <CInputString
            icon={Star}
            value={strState}
            onChange={setStrState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - disabled placeholder">
          <CInputString placeholder="Placeholder" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea - disabled">
          <CInputTextarea value={strState} onChange={setStrState} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea - disabled placeholder">
          <CInputTextarea placeholder="Placeholder" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword - disabled">
          <CInputPassword value={strState} onChange={setStrState} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword - disabled placeholder">
          <CInputPassword placeholder="Placeholder" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - disabled">
          <CInputNumber
            value={numberState}
            onChange={setNumberState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - disabled placeholder">
          <CInputNumber placeholder="Placeholder" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputJson - disabled">
          <CInputJson value={jsonState} onChange={setJsonState} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputJson - group disabled">
          <fieldset disabled className="group">
            <CInputJson value={jsonState} onChange={setJsonState} />
          </fieldset>
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - disabled">
          <CCombobox
            icon={Star}
            list={list}
            value={listState}
            onChange={setListState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - disabled placeholder">
          <CCombobox list={list} disabled placeholder="Placeholder" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - disabled">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrState}
            onChange={setStrArrState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - filled disabled">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrStateFilled}
            onChange={setStrArrStateFilled}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - disabled">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - filled disabled">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            value={idsState}
            onChange={setIdsState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - disabled checked">
          <CCheckbox selected disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - disabled label">
          <CCheckbox
            selected={boolState}
            onChange={setBoolState}
            label="Label"
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - radio - disabled checked">
          <CCheckbox radio selected disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CCheckbox - radio - disabled label">
          <CCheckbox
            radio
            selected={boolState}
            onChange={setBoolState}
            label="Label"
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CRadioGroup - disabled">
          <CRadioGroup
            list={list}
            value={listState}
            onChange={setListState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch - disabled checked">
          <CSwitch selected={true} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CSwitch - disabled label">
          <CSwitch
            selected={boolState}
            onChange={setBoolState}
            label="Label"
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - disabled">
          <CInputDate
            icon={Star}
            value={dateState}
            onChange={setDateState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - disabled placeholder">
          <CInputDate icon={Star} placeholder="Placeholder" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - disabled">
          <CInputTime value={timeState} onChange={setTimeState} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - disabled placeholder">
          <CInputTime placeholder="Placeholder" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - disabled">
          <CInputDatetime
            value={datetimeState}
            onChange={setDatetimeState}
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - disabled placeholder">
          <CInputDatetime placeholder="Placeholder" disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile - disabled">
          <CInputFile
            value={fileStateEmpty}
            onChange={setFileStateEmpty}
            disabled
          />
        </CDevComponentLine>
        <CDevComponentLine label="CInputFile - preselected disabled">
          <CInputFile value={fileState} onChange={setFileState} disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CSlider - disabled">
          <CSlider value={numberState} onChange={setNumberState} disabled />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputString - invalid">
          <CInputString placeholder="String" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CInputString - icon invalid">
          <CInputString icon={Star} placeholder="String" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea - invalid">
          <CInputTextarea placeholder="Textarea" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword - invalid">
          <CInputPassword placeholder="Password" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - invalid">
          <CInputNumber placeholder="Number" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - invalid">
          <CCombobox list={list} invalid placeholder="Combo" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - invalid">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrState}
            onChange={setStrArrState}
            invalid
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - filled invalid">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrStateFilled}
            onChange={setStrArrStateFilled}
            invalid
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - invalid">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            invalid
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - invalid">
          <CInputDate placeholder="Placeholder" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - invalid">
          <CInputTime placeholder="Placeholder" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - invalid">
          <CInputDatetime placeholder="Placeholder" invalid />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile - invalid">
          <CInputFile invalid />
        </CDevComponentLine>
        <CDevComponentLine label="CInputFile - preselected invalid">
          <CInputFile value={fileState} onChange={setFileState} invalid />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputString - required">
          <CInputString
            placeholder="String"
            value={strStateEmpty}
            onChange={setStrStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTextarea - required">
          <CInputTextarea
            placeholder="Textarea"
            value={strStateEmpty}
            onChange={setStrStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword - required">
          <CInputPassword
            placeholder="Password"
            value={strStateEmpty}
            onChange={setStrStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - required">
          <CInputNumber
            placeholder="Number"
            value={numberStateEmpty}
            onChange={setNumberStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - required">
          <CCombobox
            list={list}
            placeholder="Combo"
            value={listStateEmpty}
            onChange={setListStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - required">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrState}
            onChange={setStrArrState}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - required">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            value={listMultiState}
            onChange={setListMultiState}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - required">
          <CInputDate
            placeholder="Date Picker"
            value={dateStateEmpty}
            onChange={setDateStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - required empty string">
          <CInputDate placeholder="Date Picker" value="" required />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - required">
          <CInputTime
            placeholder="Placeholder"
            value={timeStateEmpty}
            onChange={setTimeStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - required empty string">
          <CInputTime
            placeholder="Placeholder"
            value={timeStateEmptyStr}
            onChange={setTimeStateEmptyStr}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - required">
          <CInputDatetime
            placeholder="Placeholder"
            value={datetimeStateEmpty}
            onChange={setDatetimeStateEmpty}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - required empty string">
          <CInputDatetime
            placeholder="Placeholder"
            value={datetimeStateEmptyStr}
            onChange={setDatetimeStateEmptyStr}
            required
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile - required">
          <CInputFile
            value={fileStateEmpty}
            onChange={setFileStateEmpty}
            required
          />
        </CDevComponentLine>

        {/* -------------------------------------------------------------- */}

        <CDevComponentLine label="CInputString - invalid disabled">
          <CInputString placeholder="String" invalid disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputPassword - invalid disabled">
          <CInputPassword placeholder="Password" invalid disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputNumber - invalid disabled">
          <CInputNumber placeholder="Number" invalid disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CCombobox - invalid disabled">
          <CCombobox list={list} invalid disabled placeholder="Combo" />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDate - invalid disabled">
          <CInputDate placeholder="Date Picker" invalid disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputTime - invalid disabled">
          <CInputTime placeholder="Placeholder" invalid disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputDatetime - invalid disabled">
          <CInputDatetime placeholder="Placeholder" invalid disabled />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - invalid disabled">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrState}
            onChange={setStrArrState}
            invalid
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputMultiString - filled invalid disabled">
          <CInputMultiString
            placeholder="Input Multi String"
            value={strArrStateFilled}
            onChange={setStrArrStateFilled}
            invalid
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CMultiSelect - invalid disabled">
          <CMultiSelect
            placeholder="Multi Select"
            list={listLongWithIcons}
            invalid
            disabled
          />
        </CDevComponentLine>

        <CDevComponentLine label="CInputFile - invalid disabled">
          <CInputFile
            value={fileStateEmpty}
            onChange={setFileStateEmpty}
            invalid
            disabled
          />
        </CDevComponentLine>
      </CDevComponentPanel>
    </CBody>
  );
}
