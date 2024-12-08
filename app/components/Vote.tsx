import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { Form, useFetcher, useSubmit } from "react-router";
import { FormEvent, useCallback } from "react";
import { qaVoteCrud } from "~/helpers/routes";
import { iconButtonSize } from "~/helpers/sizes";

type Props = {
  qaId: string;
  questionId: string;
  hasVoted: boolean;
};

export function Vote({ qaId, questionId, hasVoted }: Props) {
  const fetcherKey = `question:${questionId}`;
  const submitVote = useSubmit();
  const fetcher = useFetcher({ key: fetcherKey });

  const handleSubmitVote = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      submitVote(
        {
          questionId: questionId,
        },

        {
          action: qaVoteCrud(qaId),
          method: "POST",
          navigate: false,
          fetcherKey,
        }
      );
    },
    [submitVote, qaId, questionId, fetcherKey]
  );
  const handleDeleteVote = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      submitVote(
        {
          questionId: questionId,
        },

        {
          action: qaVoteCrud(qaId),
          method: "DELETE",
          navigate: false,
          fetcherKey,
        }
      );
    },
    [submitVote, qaId, questionId, fetcherKey]
  );

  const isFetching = fetcher.state !== "idle";
  const canVote = !isFetching && fetcher.state === "idle" && !hasVoted;

  return canVote ? (
    <Form onSubmit={handleSubmitVote}>
      <Tooltip content="Vote">
        <IconButton loading={isFetching} variant="soft" type="submit" size={iconButtonSize}>
          <DoubleArrowUpIcon />
        </IconButton>
      </Tooltip>
    </Form>
  ) : (
    <Form onSubmit={handleDeleteVote}>
      <Tooltip content="Remove vote">
        <IconButton loading={isFetching} variant="soft" type="submit" size={iconButtonSize} color="red">
          <DoubleArrowDownIcon />
        </IconButton>
      </Tooltip>
    </Form>
  );
}
