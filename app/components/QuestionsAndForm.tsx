import { Box, Button, Flex, TextField } from "@radix-ui/themes";
import { Form, useSubmit } from "@remix-run/react";
import { FormEvent, useCallback } from "react";
import { qaQuestionCrud } from "~/helpers/routes";
import { Question } from "./Question";

type Props = {
  qaId: string;
  topicId: string;
  participantId: string;
  questions: {
    id: string;
    text: string;
    participantId: string;
    votes: {
      questionId: string;
    }[];
  }[];
  participantVotes: {
    [questionId: string]: boolean;
  };
};

export function QuestionsAndForm({
  qaId,
  topicId,
  questions,
  participantId,
  participantVotes,
}: Props) {
  const submitQuestion = useSubmit();

  const handleSubmitQuestion = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      submitQuestion(
        {
          topicId,
          text: event.currentTarget["text"].value,
        },
        {
          action: qaQuestionCrud(qaId),
          method: "POST",
          navigate: false,
        }
      );
      event.currentTarget.reset();
    },
    [submitQuestion, topicId, qaId]
  );

  return (
    <Box>
      {questions.length > 0 ? (
        <ol>
          {questions.map((question) => (
            <li key={question.id}>
              <Question
                qaId={qaId}
                topicId={topicId}
                question={question}
                participantId={participantId}
                participantVotes={participantVotes}
                voteCount={question.votes.length}
              />
            </li>
          ))}
        </ol>
      ) : (
        <p>No questions yet</p>
      )}
      <Form onSubmit={handleSubmitQuestion}>
        <Flex maxWidth="6" gap="2" mt="5">
          <TextField.Root placeholder="Your question" name="text" required />
          <Button type="submit">Add question</Button>
        </Flex>
      </Form>
    </Box>
  );
}
