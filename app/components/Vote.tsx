import { PlusIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { FormEvent, useCallback } from "react";
import { qaVoteCrud } from "~/helpers/routes";

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
  const canVote = fetcher.state === "idle" && !hasVoted;

  return canVote ? (
    <Form onSubmit={handleSubmitVote}>
      <IconButton variant="soft" type="submit" size="1" title={`Vote`}>
        <PlusIcon />
      </IconButton>
    </Form>
  ) : null;
}
