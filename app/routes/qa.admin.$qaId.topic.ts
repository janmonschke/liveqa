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
      const order = parseInt(body.get("order")?.toString() || "0", 10);
      await db.topic.create({
        data: {
          qaId: qa.id,
          title,
          order,
        },
      });
      break;
    }
    case "PATCH": {
      const topicId = body.get("topicId")?.toString();
      if (!topicId) {
        throw new Response("Not Found", { status: 404 });
      }
      const orderStr = body.get("order")?.toString();
      if (!orderStr) {
        throw new Response("`order` missing", { status: 400 });
      }
      const order = parseInt(orderStr, 10);
      await db.topic.update({
        where: {
          id: topicId,
          qaId: qa.id,
        },
        data: {
          order,
        },
      });
      break;
    }
  }
  emitter.emit(updateQaEvent(qa.id), Date.now());
  return redirect(qaAdmin(qa.id));
};
