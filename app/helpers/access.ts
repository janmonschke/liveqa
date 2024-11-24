import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";

export async function isQaAdmin(qaId: string | undefined, request: Request) {
  invariant(qaId, "A valid `qaId` needs to be passed");
  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: 'You need to be the QA host to access this page'
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
              votes: true
            }
          }
        }
      }
    }
  });

  if (qa?.hostId != host.id) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: 'You are not the admin of this QA'
    });
  }

  return qa;
}
