import { Form } from "@remix-run/react";
import { Box, Button, Heading, TextField } from "@radix-ui/themes";
import { CenteredMediumContaner } from "./CenteredMediumContainer";

export const AuthForm: React.FC<{ actionLabel: string; headline: string }> = ({
  actionLabel,
  headline,
}) => (
  <CenteredMediumContaner>
    <Heading>{headline}</Heading>
    <Box>
      <Form method="post">
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
        />
        <Box mt="2" mb="1">
          <label htmlFor="password"> 
            Password:
          </label>
        </Box>
        <TextField.Root
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          required
          minLength={4}
          mb="4"
        />
          <Button>{actionLabel}</Button>
      </Form>
    </Box>
  </CenteredMediumContaner>
);
