import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: "sk_dev_RDJwsuOtkr13Mbn1sxbXcpUxUCdOLukkX7WG2-DQRj2SzSLueHmgN9crH6Wm--Ap",
});

export async function POST(request: NextRequest) {
  // Try to read a name from the request. The client can send it as a
  // query parameter (?name=...) or as JSON in the POST body { name }.
  const url = new URL(request.url);
  const nameFromQuery = url.searchParams.get("name");

  console.log(url)
  console.log(nameFromQuery)
  let name: string | null = nameFromQuery;
  try {
    const body = await request.json().catch(() => null);
    if (body && typeof body.name === "string") {
      name = body.name;
    }
  } catch (e) {
    // ignore parse errors, we'll fallback to random user
  }

  // Get the current user's unique id from your database (fallback)
  const userId = Math.floor(Math.random() * 10) % USER_INFO.length;

  // Build userInfo. If a name was provided by the client, use it and
  // reuse other properties from the fallback user. Otherwise use the
  // pre-defined USER_INFO entry.
  const userInfo = name
    ? { ...USER_INFO[userId], name }
    : USER_INFO[userId];

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(`user-${userId}`, {
    userInfo,
  });

  // Use a naming pattern to allow access to rooms with a wildcard
  session.allow(`liveblocks:examples:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  console.log("Liveblocks auth response:", body, status);
  return new Response(body, { status });
}

const USER_INFO = [
  {
    name: "Charlie Layne",
    color: "#D583F0",
    picture: "https://liveblocks.io/avatars/avatar-1.png",
  },
  {
    name: "Mislav Abha",
    color: "#F08385",
    picture: "https://liveblocks.io/avatars/avatar-2.png",
  },
  {
    name: "Tatum Paolo",
    color: "#F0D885",
    picture: "https://liveblocks.io/avatars/avatar-3.png",
  },
  {
    name: "Anjali Wanda",
    color: "#85EED6",
    picture: "https://liveblocks.io/avatars/avatar-4.png",
  },
  {
    name: "Jody Hekla",
    color: "#85BBF0",
    picture: "https://liveblocks.io/avatars/avatar-5.png",
  },
  {
    name: "Emil Joyce",
    color: "#8594F0",
    picture: "https://liveblocks.io/avatars/avatar-6.png",
  },
  {
    name: "Jory Quispe",
    color: "#85DBF0",
    picture: "https://liveblocks.io/avatars/avatar-7.png",
  },
  {
    name: "Quinn Elton",
    color: "#87EE85",
    picture: "https://liveblocks.io/avatars/avatar-8.png",
  },
];