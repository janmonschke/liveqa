import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { Form, useSubmit } from "@remix-run/react";
import { FormEvent, useCallback } from "react";
import { qaQuestionCrud } from "~/helpers/routes";
import { Vote } from "./Vote";

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
  return (
    <Flex>
      <Box>
        {question.text} - {voteCount}
      </Box>
      <Vote hasVoted={hasVoted} questionId={question.id} qaId={qaId} />
      {question.participantId === participantId ? (
        <Form onSubmit={handleDeleteQuestion}>
          <IconButton
            variant="soft"
            type="submit"
            color="red"
            size="1"
            title={`Delete question: ${question.text}`}
          >
            <Cross2Icon />
          </IconButton>
        </Form>
      ) : null}
    </Flex>
  );
}
