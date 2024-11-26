import { Box, Button, Flex, TextField } from "@radix-ui/themes";
import { Form, useSubmit } from "@remix-run/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
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
  const [localQ, setLocalQ] = useState(questions);

  useEffect(() => {
    setLocalQ(questions);
  }, [questions]);

  const handleSubmitQuestion = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const text = event.currentTarget["text"].value;
      submitQuestion(
        {
          topicId,
          text,
        },
        {
          action: qaQuestionCrud(qaId),
          method: "POST",
          navigate: false,
        }
      );
      event.currentTarget.reset();
      setLocalQ((currQ) => {
        return [
          ...currQ,
          {
            participantId,
            id: Math.random().toString(),
            votes: [],
            text,
          },
        ];
      });
    },
    [submitQuestion, topicId, qaId, participantId]
  );
  const hasQuestions = localQ.length > 0;

  return (
    <Box>
      {hasQuestions ? (
        <ol>
          {localQ.map((question) => (
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
