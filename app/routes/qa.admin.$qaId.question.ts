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
      const questionId = body.get("questionId")?.toString();
      if (!questionId) {
        throw new Response("Not Found", { status: 404 });
      }
      await db.question.delete({
        where: {
          id: questionId,
        },
      });
      break;
    }
  }
  emitter.emit(updateQaEvent(qa.id), Date.now());
  return redirect(qaAdmin(qa.id));
};

