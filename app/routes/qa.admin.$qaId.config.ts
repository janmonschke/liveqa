import { ActionFunction, redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { isQaAdmin } from "~/helpers/access";
import { qaAdmin } from "~/helpers/routes";

export const action: ActionFunction = async ({ request, params }) => {
  const qa = await isQaAdmin(params.qaId, request);
  const body = await request.formData();

  switch (request.method) {
    case "POST": {
      const areVotesEnabled = body.get("areVotesEnabled")?.toString() === 'true';
      await db.qAConfig.update({
        data: {
          areVotesEnabled,
        },
        where: {
          qaId: qa.id
        }
      });
    }
  }
  return redirect(qaAdmin(qa.id));
};

