import type { PropsWithChildren } from "react";
import "./CenteredMediumContainer.css";

export function CenteredMediumContaner({ children }: PropsWithChildren) {
  return (
    <section className="CenteredMediumContainer">
      <div className="CenteredMediumContainerContent">{children}</div>
    </section>
  );
}
