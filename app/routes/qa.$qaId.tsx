import { Box, Heading } from "@radix-ui/themes";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { QuestionsAndForm } from "~/components/QuestionsAndForm";
import { db } from "~/db.server";
import { qa } from "~/helpers/routes";
import { participantSessionStorage } from "~/services/participantSession.server";

async function makeOrReadParticipant(qaId: string, request: Request) {
  const participantSession = await participantSessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const participantId = participantSession.get(qaId);

  if (participantId) {
    const participant = await db.participant.findFirst({
      where: {
        id: participantId,
        qaId,
      },
    });

    if (!participant) {
      throw new Response("Could not find participant", { status: 404 });
    }
    return participant;
  }

  const participant = await db.participant.create({
    data: {
      qaId,
    },
  });

  participantSession.set(qaId, participant.id);
  throw redirect(qa(qaId), {
    headers: {
      "Set-Cookie": await participantSessionStorage.commitSession(
        participantSession
      ),
    },
  });
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { qaId } = params;
  if (!qaId) {
    throw new Response("qaId missing", { status: 400 });
  }
  const participant = await makeOrReadParticipant(qaId, request);
  const qa = await db.qA.findFirstOrThrow({
    where: {
      id: qaId,
    },
    include: {
      QAConfig: true,
      Topic: {
        include: {
          questions: {
            orderBy: [{ votes: { _count: "desc" } }, { createdAt: "asc" }],
            include: {
              votes: {
                select: {
                  id: true,
                  questionId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const participantVotes = (
    await db.vote.findMany({
      where: {
        participantId: participant.id,
      },
    })
  ).reduce((acc, curr) => {
    acc[curr.questionId] = true;
    return acc;
  }, {} as Record<string, boolean>);
  return json({ qa, participant, participantVotes });
};

export default function QaView() {
  const { qa, participant, participantVotes } = useLoaderData<typeof loader>();
  return (
    <section>
      <Heading as="h1" size="8" mb="3">
        {qa.title}
      </Heading>
      <Heading as="h2" mb="2">
        Topics
      </Heading>
      {qa.Topic.map((topic) => (
        <Box key={topic.id} mb="4">
          <Box mb="2">
            <Heading as="h3" size="4">
              {topic.title}
            </Heading>
          </Box>

          <QuestionsAndForm
            qaId={qa.id}
            topicId={topic.id}
            participantId={participant.id}
            questions={topic.questions}
            participantVotes={participantVotes}
          />
        </Box>
      ))}
    </section>
  );
}
