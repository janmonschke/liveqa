import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteLoaderData,
} from "@remix-run/react";
import { Container, Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { popToast } from "./services/toast.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Toast } from "./components/Toast";

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await popToast(request);
  return Response.json({ toast }, { headers });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🙋‍♀️</text></svg>"
        ></link>
        <title>Live QA - Ask your questions</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Theme>
          <ThemePanel defaultOpen={false} />
          <Toast toast={data?.toast} />
          <Container>{children}</Container>
        </Theme>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
