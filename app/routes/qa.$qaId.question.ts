import { ActionFunction, redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { isQaParticipant } from "~/helpers/access";
import { qa } from "~/helpers/routes";

export const action: ActionFunction = async ({ request, params }) => {
  const { qaId } = params;
  const body = await request.formData();
  const topicId = body.get("topicId")?.toString();
  if (!topicId || !qaId) {
    throw new Response("", { status: 404, statusText: '`topicId` missing' });
  }

  const participant = await isQaParticipant(qaId, request);

  switch (request.method) {
    case "DELETE": {
      const questionId = body.get('questionId')?.toString();
      if (!questionId) {
        throw new Response('Question not found', { status: 404 })
      }
      await db.question.delete({
        where: {
          id: questionId,
          topicId,
          participantId: participant.id,
        },
      });
      break;
    }
    case "POST": {
      const text = body.get("text")?.toString();
      if (!text) {
        throw new Response("`text` missing", { status: 400 });
      }
      await db.question.create({
        data: {
          topicId,
          participantId: participant.id,
          text,
        },
      });
    }
  }
  return redirect(qa(qaId));
};

