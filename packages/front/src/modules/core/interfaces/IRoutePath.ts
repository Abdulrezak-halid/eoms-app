/**
 * @file: IRoutePath.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.04.2025
 * Last Modified Date: 02.04.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { routes } from "@/routes";

export type IRoutePath = (typeof routes)[number]["path"];
