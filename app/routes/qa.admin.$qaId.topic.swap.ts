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
    case "POST": {
      const topicAId = body.get("topicAId")?.toString();
      const topicBId = body.get("topicBId")?.toString();
      const newPositionA = body.get("newPositionA")?.toString();
      const newPositionB = body.get("newPositionB")?.toString();

      if (!topicAId || !topicBId || !newPositionA || !newPositionB) {
        throw new Response("", {
          status: 400,
          statusText:
            "One of `topicAId`, `topicBId`, `newPositionA`, `newPositionB` is missing.",
        });
      }

      const positionANumber = parseInt(newPositionA, 10);
      const positionBNumber = parseInt(newPositionB, 10);

      await db.$transaction([
        db.topic.update({
          where: {
            id: topicAId,
            qaId: qa.id,
          },
          data: {
            order: positionANumber,
          },
        }),
        db.topic.update({
          where: {
            id: topicBId,
            qaId: qa.id,
          },
          data: {
            order: positionBNumber,
          },
        }),
      ]);

      break;
    }
  }
  emitter.emit(updateQaEvent(qa.id), Date.now());
  return redirect(qaAdmin(qa.id));
};
