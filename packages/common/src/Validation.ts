
export const MAX_API_STRING_LENGTH = 100;
export const MAX_API_STRING_LONG_LENGTH = 300;
export const MAX_API_NUMBER_VALUE = 1000000000;
export const MAX_REPORT_TEXT_STRING_LENGTH = 2000;
export const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
export const WORKSPACE_REGEX = /^[a-zA-Z0-9\-_]{3,80}$/;
export const DOMAIN_REGEX =
  /^(?!-)(?:[a-zA-Z0-9_-]{1,63}\.)*[a-zA-Z0-9_-]{1,63}$/;
export const IP_REGEX =
  /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/;
export const DOMAIN_IP_REGEX =
  /^(?:(?!-)(?:[a-zA-Z0-9_-]{1,63}\.)*[a-zA-Z0-9_-]{1,63}|(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3})$/;
export const URL_REGEX =
  /^https?:\/\/((([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)?)$/;
export const PASSWORD_REGEX = /^.{8,30}$/;
export const MIN_ISSUE_DESC = 50;
export const MAX_ISSUE_DESC = 300;
export const MIN_YEAR = 1970;
export const MAX_YEAR = 2099;
export const MAX_REPORT_TABLE_ROW_LENGTH = 50;
export const MAX_REPORT_TABLE_COLUMN_LENGTH = 12;
