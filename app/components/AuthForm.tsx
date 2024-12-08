import { Form, useFetcher } from "react-router";
import { Box, Button, Heading, TextField } from "@radix-ui/themes";
import { CenteredMediumContaner } from "./CenteredMediumContainer";

type Props = {
  actionLabel: string;
  headline: string;
};

export function AuthForm({ actionLabel, headline }: Props) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  return (
    <CenteredMediumContaner>
      <Heading>{headline}</Heading>
      <Box>
        <fetcher.Form method="post">
          <Box mt="2" mb="1">
            <label htmlFor="name">Username:</label>
          </Box>
          <TextField.Root
            type="text"
            name="name"
            id="name"
            required
            minLength={3}
            mb="2"
            disabled={isLoading}
          />
          <Box mt="2" mb="1">
            <label htmlFor="password">Password:</label>
          </Box>
          <TextField.Root
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
            minLength={4}
            mb="4"
            disabled={isLoading}
          />
          <Button disabled={isLoading} loading={isLoading}>
            {actionLabel}
          </Button>
        </fetcher.Form>
      </Box>
    </CenteredMediumContaner>
  );
}
