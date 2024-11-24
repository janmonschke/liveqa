import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  TextField,
  Text,
} from "@radix-ui/themes";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { FormEvent } from "react";
import { isQaAdmin } from "~/helpers/access";
import { qaConfigCrud, qaTopicCrud } from "~/helpers/routes";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const qa = await isQaAdmin(params.qaId, request);
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

  return (
    <section>
      <Heading as="h1" size="8" mb="3">
        {qa.title}
      </Heading>
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
            <ol>
              {topic.questions.map((question) => (
                <li key={question.id}>
                  {question.text} - {question.votes.length}
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

