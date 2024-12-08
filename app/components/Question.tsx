import { Cross2Icon } from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { Form, useFetcher, useSubmit } from "react-router";
import { FormEvent, useCallback } from "react";
import { qaQuestionCrud } from "~/helpers/routes";
import { Vote } from "./Vote";
import { iconButtonSize } from "~/helpers/sizes";
import { BaseQuestion } from "./BaseQuestion";

type Props = {
  qaId: string;
  votingEnabled: boolean;
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
  votingEnabled,
  topicId,
  voteCount,
  participantId,
  question,
  participantVotes,
}: Props) {
  const deleteQuestion = useSubmit();
  const fetcherKey = `deleteQuestion:${question.id}`;
  const deleteFetcher = useFetcher({
    key: fetcherKey,
  });
  const isDeleting = deleteFetcher.state !== "idle";
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
            fetcherKey,
          }
        );
      }
    },
    [deleteQuestion, topicId, qaId, question, fetcherKey]
  );
  const hasVoted = participantVotes[question.id] === true;
  return (
    <BaseQuestion
      text={question.text}
      voteCount={voteCount}
      actions={
        <>
          {votingEnabled ? (
            <Vote hasVoted={hasVoted} questionId={question.id} qaId={qaId} />
          ) : null}
          {question.participantId === participantId ? (
            <Form onSubmit={handleDeleteQuestion}>
              <Tooltip content={`Delete question: ${question.text}`}>
                <IconButton
                  variant="soft"
                  type="submit"
                  color="red"
                  size={iconButtonSize}
                  loading={isDeleting}
                  disabled={isDeleting}
                >
                  <Cross2Icon />
                </IconButton>
              </Tooltip>
            </Form>
          ) : null}
        </>
      }
    />
  );
}
