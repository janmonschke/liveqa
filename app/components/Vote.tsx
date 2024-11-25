import { PlusIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { Form, useSubmit } from "@remix-run/react";
import { FormEvent, useCallback } from "react";
import { qaVoteCrud } from "~/helpers/routes";

type Props = {
  qaId: string;
  questionId: string;
  hasVoted: boolean;
};

export function Vote({ qaId, questionId, hasVoted }: Props) {
  const submitVote = useSubmit();

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
        }
      );
    },
    [submitVote, qaId, questionId]
  );

  return hasVoted ? null : (
    <Form onSubmit={handleSubmitVote}>
      <IconButton variant="soft" type="submit" size="1" title={`Vote`}>
        <PlusIcon />
      </IconButton>
    </Form>
  );
}
