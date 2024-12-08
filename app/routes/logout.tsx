import type { LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: "/" });
}
