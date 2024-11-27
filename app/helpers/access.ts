import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { participantSessionStorage } from "~/services/participantSession.server";

export async function isQaAdmin(qaId: string | undefined, request: Request) {
  invariant(qaId, "A valid `qaId` needs to be passed");
  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "You need to be the QA host to access this page",
    });
  }

  const qa = await db.qA.findFirst({
    where: {
      id: qaId,
    },
    include: {
      QAConfig: true,
      Topic: {
        include: {
          questions: {
            include: {
              votes: true,
            },
          },
        },
      },
    },
  });

  if (qa?.hostId != host.id) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "You are not the admin of this QA",
    });
  }

  return qa;
}

export async function isQaParticipant(
  qaId: string | undefined,
  request: Request
) {
  invariant(qaId, "A valid `qaId` needs to be passed");

  const participantSession = await participantSessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const participantId = participantSession.get(qaId);
  const qa = await db.qA.findFirstOrThrow({
    where: {
      id: qaId,
    },
    include: {
      Participant: {
        where: {
          id: participantId,
        },
      },
    },
  });

  const isParticipant = qa.Participant.length === 1;
  if (isParticipant) {
    return qa.Participant[0];
  } else {
    throw new Response("You need to be a participant", { status: 403 });
  }
}

export async function isVotingEnabledForQa(qaId: string | undefined) {
  const qaConfig = await db.qAConfig.findFirstOrThrow({
    where: {
      qaId,
    },
  });
  return qaConfig.areVotesEnabled;
}
