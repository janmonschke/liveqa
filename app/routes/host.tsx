import { Box, Button, Flex, Heading, TextField } from "@radix-ui/themes";
import {
  ActionFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { qaAdmin } from "~/helpers/routes";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const host = await authenticator.isAuthenticated(request);
  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }
  const qas = await db.qA.findMany({
    where: {
      hostId: host.id,
    },
  });
  return { qas, host };
};

export const action: ActionFunction = async ({ request }) => {
  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

  const body = await request.formData();
  const title = body.get("title")?.toString();
  const hostId = body.get("hostId")?.toString();
  invariant(title, "A `title` needs to be passed");
  invariant(hostId, "A `hostId` needs to be passed");
  const qa = await db.qA.create({
    data: {
      title,
      hostId,
      QAConfig: {
        create: {
          areVotesEnabled: true
        }
      }
    },
  });
  return redirect(qaAdmin(qa.id));
};

export default function Host() {
  const { qas, host } = useLoaderData<typeof loader>();
  return (
    <>
      <Box mb="4">
        <Heading as="h1">QAs</Heading>
        {qas.length > 0 ? (
          <ul>
            {qas.map((qa) => (
              <li key={qa.id}>
                <Link to={qaAdmin(qa.id)}>{qa.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not yet created a QA</p>
        )}
      </Box>
      <Form method="post">
        <Heading as="h2" size="4" mb="2">
          New QA
        </Heading>
        <Flex maxWidth="6" gap="2">
          <TextField.Root placeholder="QA title" name="title" required />
          <input type="hidden" name="hostId" value={host.id} /> 
          <Button type="submit">Create QA</Button>
        </Flex>
      </Form>
    </>
  );
}
