import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { ReactElement } from "react";

type Props = {
  text: string;
  voteCount: number;
  actions: ReactElement;
};

export function BaseQuestion({ text, voteCount, actions }: Props) {
  const voteCountText = voteCount === 1 ? "1 vote" : `${voteCount} votes`;
  return (
    <Card variant="surface">
      <Flex p="1" justify="between" align="center" gap="3">
        <Flex direction="column">
          <Box>{text}</Box>
          <Box>
            <Text size="1" color="gray">
              {voteCountText}
            </Text>
          </Box>
        </Flex>
        <Flex gap="3">{actions}</Flex>
      </Flex>
    </Card>
  );
}
