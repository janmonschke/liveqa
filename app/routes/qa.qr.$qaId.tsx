import * as React from "react";
import * as qr from "qrcode";
import { Flex, Heading } from "@radix-ui/themes";

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const useLayoutEffect = canUseDOM ? React.useLayoutEffect : () => {};

export default function QaQr() {
  useLayoutEffect(() => {
    const path = location.pathname.replace("qr/", "");
    const host = location.host;
    const url = `${location.protocol}//${host}${path}`;
    document.getElementById('qrurl').innerText = url;
    qr.toCanvas(document.getElementById("qrcode"), url, {
      width: 600,
      height: 600,
    });
  });
  return (
    <Flex align="center" justify="center" direction="column" gap="2">
      <canvas id="qrcode" />
      <Heading size="8" id="qrurl"></Heading>
    </Flex>
  );
}
