import { Heading } from "@radix-ui/themes";
import { CenteredMediumContaner } from "~/components/CenteredMediumContainer";

export default function Index() {
  return (
    <CenteredMediumContaner>
      <Heading as="h1" size="8" mb="2">Live QA</Heading>
      <Heading as="h2" size="6">- in private beta -</Heading>
    </CenteredMediumContaner>
  );
}
