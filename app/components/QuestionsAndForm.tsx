import { Badge, Box, Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import { useFetcher, useSubmit } from "@remix-run/react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { qaQuestionCrud } from "~/helpers/routes";
import { Question } from "./Question";
import "./QuestionsAndForm.css";

type Props = {
  qaId: string;
  topic: string;
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
  topic,
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

  const fetcher = useFetcher({
    key: "question",
  });
  const isLoading = fetcher.state !== "idle";
  const currFetcherState = useRef("idle");

  useEffect(() => {
    const oldState = currFetcherState.current;
    if (oldState !== "idle" && fetcher.state === "idle") {
      setIsOpen(false);
    }
    currFetcherState.current = fetcher.state;
  }, [fetcher.state]);

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
          fetcherKey: "question",
        }
      );
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
  const [isOpen, setIsOpen] = useState(false);
  const hasQuestions = localQ.length > 0;

  return (
    <Box>
      {hasQuestions ? (
        <ol className="QuestionsList">
          {localQ.map((question) => (
            <li key={question.id}>
              <Box mb="2">
                <Question
                  qaId={qaId}
                  topicId={topicId}
                  question={question}
                  participantId={participantId}
                  participantVotes={participantVotes}
                  voteCount={question.votes.length}
                />
              </Box>
            </li>
          ))}
        </ol>
      ) : (
        <p>No questions yet</p>
      )}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger>
          <Button>Add question</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>New question</Dialog.Title>
          <Dialog.Description>
            Add a new question to{" "}
            <Badge color="indigo" size="2">
              {topic}
            </Badge>
            {" :"}
          </Dialog.Description>
          <fetcher.Form onSubmit={handleSubmitQuestion}>
            <Flex maxWidth="6" gap="2" mt="4" direction="column">
              <TextField.Root
                placeholder="Your question"
                name="text"
                required
                disabled={isLoading}
              />
              <Flex justify="end" gap="2">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>

                <Button disabled={isLoading} loading={isLoading} type="submit">
                  Add question
                </Button>
              </Flex>
            </Flex>
          </fetcher.Form>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
