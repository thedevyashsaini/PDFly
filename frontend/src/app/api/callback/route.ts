import { auth } from "@/app/actions";
import { client, setTokens } from "../../auth";
import { type NextRequest, NextResponse } from "next/server";
import { SelectUser } from "@/db/schema";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const exchanged = await client.exchange(
    code!,
    `${process.env.NEXT_PUBLIC_HOST}/api/callback`
  );
  console.log(exchanged);
  if (exchanged.err) return NextResponse.json(exchanged.err, { status: 400 });
  await setTokens(exchanged.tokens.access, exchanged.tokens.refresh);

  const subject = await auth();

  if (subject) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/user/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: subject.properties.id }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get user.");
    }

    const data = await response.json();

    console.log(data);

    if (!data.success && data.message === "User not found") {
      const user: SelectUser = subject.properties;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/user/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user.");
      }

      const data = await response.json();

      console.log(data);
    }
  }

  return NextResponse.redirect(`${url.origin}/app`);
}
