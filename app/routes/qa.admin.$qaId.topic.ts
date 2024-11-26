import { ActionFunction, redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { isQaAdmin } from "~/helpers/access";
import { updateQaEvent } from "~/helpers/events";
import { qaAdmin } from "~/helpers/routes";
import { emitter } from "~/services/emitter.server";

export const action: ActionFunction = async ({ request, params }) => {
  const qa = await isQaAdmin(params.qaId, request);
  const body = await request.formData();

  switch (request.method) {
    case "DELETE": {
      const topicId = body.get("topicId")?.toString();
      if (!topicId) {
        throw new Response("Not Found", { status: 404 });
      }
      await db.topic.delete({
        where: {
          id: topicId,
          qaId: qa.id,
        },
      });
      break;
    }
    case "POST": {
      const title = body.get("title")?.toString();
      if (!title) {
        throw new Response("`title` missing", { status: 400 });
      }
      await db.topic.create({
        data: {
          qaId: qa.id,
          title,
        },
      });
    }
  }
  emitter.emit(updateQaEvent(qa.id), Date.now());
  return redirect(qaAdmin(qa.id));
};
