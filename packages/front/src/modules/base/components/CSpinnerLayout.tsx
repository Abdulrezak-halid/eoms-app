/**
 * @file: CSpinnerLayout.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.12.2024
 * Last Modified Date: 01.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

// This spinner is insensitive to theme
export function CSpinnerLayout({ msg }: { msg?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex-none rounded-full border-gray-100 border-b-transparent! animate-spin border-4 w-12 h-12" />
      <div className="mt-4 leading-4 text-gray-300">{msg || <>&nbsp;</>}</div>
    </div>
  );
}
