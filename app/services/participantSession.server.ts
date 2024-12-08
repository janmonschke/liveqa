import { createCookieSessionStorage } from "react-router";

type SessionData = {
  [qaId: string]: string;
};

export const participantSessionStorage =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "participantLiveQaSesh",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 100,
      httpOnly: true,
      secrets: [process.env.SESSION_SECRET ?? "s3cr3t"],
      secure: process.env.NODE_ENV === "production",
    },
  });
