import { ArrowTopRightIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  TextField,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { FormEvent } from "react";
import { BaseQuestion } from "~/components/BaseQuestion";
import { db } from "~/db.server";
import { isQaAdmin } from "~/helpers/access";
import {
  qaAdminQuestionCrud,
  qaConfigCrud,
  qaQr,
  qaTopicCrud,
  qa as qaUrl,
} from "~/helpers/routes";
import { iconButtonSize } from "~/helpers/sizes";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await isQaAdmin(params.qaId, request);
  const qa = await db.qA.findFirstOrThrow({
    where: {
      id: params.qaId,
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

  return json({ qa });
};

export default function QaAdmin() {
  const { qa } = useLoaderData<typeof loader>();
  const configSubmit = useSubmit();

  function handleChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const params = {
      ["areVotesEnabled"]: event.currentTarget["areVotesEnabled"].checked,
    };
    configSubmit(params, {
      action: qaConfigCrud(qa.id),
      method: "POST",
      navigate: false,
    });
  }

  const deleteQuestion = useSubmit();
  const handleDeleteQuestion = (
    event: FormEvent<HTMLFormElement>,
    questionId: string,
    questionText: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      confirm(`Are you sure you want to delete the question: ${questionText} ?`)
    ) {
      deleteQuestion(
        {
          questionId: questionId,
        },

        {
          action: qaAdminQuestionCrud(qa.id),
          method: "DELETE",
          navigate: false,
        }
      );
    }
  };

  return (
    <section>
      <Heading as="h1" size="8" mb="2">
        {qa.title}
      </Heading>
      <Flex mb="3" gap="2">
        <Link to={qaQr(qa.id)} target="_blank" rel="noreferrer">
          Open QR code <ArrowTopRightIcon />
        </Link>
        <Link to={qaUrl(qa.id)} target="_blank" rel="noreferrer">
          Open Live QA <ArrowTopRightIcon />
        </Link>
      </Flex>
      <Heading as="h2" mb="2">
        Config
      </Heading>
      {qa.QAConfig && (
        <Box mb="4">
          <Form onChange={handleChange}>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox
                  defaultChecked={qa.QAConfig.areVotesEnabled}
                  name="areVotesEnabled"
                />
                voting enabled
              </Flex>
            </Text>
          </Form>
        </Box>
      )}
      <Heading as="h2" mb="2">
        Topics
      </Heading>
      {qa.Topic.map((topic) => (
        <Box key={topic.id} mb="4">
          <Flex gap="3" align="center" mb="2">
            <Heading as="h3" size="4">
              {topic.title}
            </Heading>
            <Form method="delete" action={qaTopicCrud(qa.id)}>
              <input type="hidden" name="topicId" value={topic.id} />
              <IconButton
                variant="soft"
                type="submit"
                color="red"
                size="1"
                title={`Delete topic: ${topic.title}`}
              >
                <Cross2Icon />
              </IconButton>
            </Form>
          </Flex>

          {topic.questions.length > 0 ? (
            <ol style={{ listStyleType: "none", padding: 0 }}>
              {topic.questions.map((question) => (
                <li key={question.id}>
                  <Box mb="2">
                    <BaseQuestion
                      text={question.text}
                      voteCount={question.votes.length}
                      actions={
                        <>
                          <Form
                            onSubmit={(event) =>
                              handleDeleteQuestion(
                                event,
                                question.id,
                                question.text
                              )
                            }
                          >
                            <Tooltip
                              content={`Delete question: ${question.text}`}
                            >
                              <IconButton
                                variant="soft"
                                type="submit"
                                color="red"
                                size={iconButtonSize}
                              >
                                <Cross2Icon />
                              </IconButton>
                            </Tooltip>
                          </Form>
                        </>
                      }
                    />
                  </Box>
                </li>
              ))}
            </ol>
          ) : (
            <p>No questions yet</p>
          )}
        </Box>
      ))}
      <Form method="post" action={qaTopicCrud(qa.id)}>
        <Flex maxWidth="6" gap="2" mt="5">
          <TextField.Root placeholder="Topic title" name="title" required />
          <Button type="submit">Create topic</Button>
        </Flex>
      </Form>
    </section>
  );
}
