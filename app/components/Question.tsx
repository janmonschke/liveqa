import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Card, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { Form, useSubmit } from "@remix-run/react";
import { FormEvent, useCallback } from "react";
import { qaQuestionCrud } from "~/helpers/routes";
import { Vote } from "./Vote";
import { iconButtonSize } from "~/helpers/sizes";

type Props = {
  qaId: string;
  topicId: string;
  participantId: string;
  voteCount: number;
  question: {
    id: string;
    participantId: string;
    text: string;
  };
  participantVotes: {
    [questionId: string]: boolean;
  };
};

export function Question({
  qaId,
  topicId,
  voteCount,
  participantId,
  question,
  participantVotes,
}: Props) {
  const deleteQuestion = useSubmit();
  const handleDeleteQuestion = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (
        confirm(
          "Are you sure you want to delete the question: " +
          question.text +
          " ?"
        )
      ) {
        deleteQuestion(
          {
            topicId,
            questionId: question.id,
          },

          {
            action: qaQuestionCrud(qaId),
            method: "DELETE",
            navigate: false,
          }
        );
      }
    },
    [deleteQuestion, topicId, qaId, question]
  );
  const hasVoted = participantVotes[question.id] === true;
  const voteCountText = voteCount === 1 ? "1 vote" : `${voteCount} votes`;
  return (
    <Card variant="surface">
      <Flex p="1" justify="between" align="center" gap="3">
        <Flex direction="column">
          <Box>{question.text}</Box>
          <Box><Text size="1" color="gray">{voteCountText}</Text></Box>
        </Flex>
        <Flex gap="3">
          <Vote hasVoted={hasVoted} questionId={question.id} qaId={qaId} />
          {question.participantId === participantId ? (
            <Form onSubmit={handleDeleteQuestion}>
              <Tooltip content={`Delete question: ${question.text}`}>
                <IconButton variant="soft" type="submit" color="red" size={iconButtonSize}>
                  <Cross2Icon />
                </IconButton>
              </Tooltip>
            </Form>
          ) : null}
        </Flex>
      </Flex>
    </Card>
  );
}
