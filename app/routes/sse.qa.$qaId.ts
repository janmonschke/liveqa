import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import invariant from "tiny-invariant";
import { updateQaEvent } from "~/helpers/events";
import { emitter } from "~/services/emitter.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { qaId } = params;
  invariant(qaId, "qaId missing");

  return eventStream(request.signal, function setup(send) {
    function onUpdate(data: string) {
      send({ event: "update", data });
    }
    emitter.on(updateQaEvent(qaId), onUpdate);

    return () => {
      emitter.off(updateQaEvent(qaId), onUpdate);
    };
  });
}
