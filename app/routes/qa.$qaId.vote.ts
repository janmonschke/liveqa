import { ActionFunction, redirect } from "react-router";
import { db } from "~/db.server";
import { isQaParticipant, isVotingEnabledForQa } from "~/helpers/access";
import { updateQaEvent } from "~/helpers/events";
import { qa } from "~/helpers/routes";
import { emitter } from "~/services/emitter.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { qaId } = params;
  const body = await request.formData();
  const questionId = body.get("questionId")?.toString();
  if (!questionId || !qaId) {
    throw new Response("", { status: 404, statusText: "`questionId` missing" });
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
      await db.vote.deleteMany({
        where: {
          questionId,
          participantId: participant.id,
        },
      });
      break;
    }
    case "POST": {
      const hasVoted = await db.vote.findFirst({
        where: {
          questionId,
          participantId: participant.id,
        },
      });

      if (hasVoted) {
        throw new Response("Illegal", {
          status: 403,
          statusText: "You cannot vote twice for the same question",
        });
      }

      await db.vote.create({
        data: {
          questionId,
          participantId: participant.id,
        },
      });
    }
  }

  emitter.emit(updateQaEvent(qaId), Date.now());
  return redirect(qa(qaId));
};
