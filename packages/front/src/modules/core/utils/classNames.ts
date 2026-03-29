/**
 * @file: classNames.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.10.2024
 * Last Modified Date: 18.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

export function classNames(...props: (string | undefined | null | false)[]) {
  return props.filter((d) => d).join(" ");
}
