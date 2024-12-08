import { ActionFunction, redirect } from "react-router";
import { db } from "~/db.server";
import { isQaParticipant, isVotingEnabledForQa } from "~/helpers/access";
import { updateQaEvent } from "~/helpers/events";
import { qa } from "~/helpers/routes";
import { emitter } from "~/services/emitter.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { qaId } = params;
  const body = await request.formData();
  const topicId = body.get("topicId")?.toString();
  if (!topicId || !qaId) {
    throw new Response("", { status: 404, statusText: "`topicId` missing" });
  }
  const isVotingEnabled = await isVotingEnabledForQa(qaId);
  if (!isVotingEnabled) {
    throw new Response("", {
      status: 403,
      statusText: "Voting and adding questions is disabled",
    });
  }

  const participant = await isQaParticipant(qaId, request);

  switch (request.method) {
    case "DELETE": {
      const questionId = body.get("questionId")?.toString();
      if (!questionId) {
        throw new Response("Question not found", { status: 404 });
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
  emitter.emit(updateQaEvent(qaId), Date.now());
  return redirect(qa(qaId));
};
