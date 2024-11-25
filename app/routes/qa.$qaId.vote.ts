import { ActionFunction, redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { isQaParticipant } from "~/helpers/access";
import { qa } from "~/helpers/routes";

export const action: ActionFunction = async ({ request, params }) => {
  const { qaId } = params;
  const body = await request.formData();
  const questionId = body.get("questionId")?.toString();
  if (!questionId || !qaId) {
    throw new Response("", { status: 404, statusText: "`questionId` missing" });
  }

  const participant = await isQaParticipant(qaId, request);

  switch (request.method) {
    case "DELETE": {
      const voteId = body.get("voteId")?.toString();
      if (!voteId) {
        throw new Response("Question not found", { status: 404 });
      }
      await db.vote.delete({
        where: {
          id: voteId,
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
  return redirect(qa(qaId));
};
