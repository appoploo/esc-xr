// lib/withSession.ts

import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      test?: boolean;
      id: string;
      userName?: string;
      admin?: boolean;
    };
  }
}

const sessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "myapp_cookiename",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

type Role = "admin" | "user";
export function accessLevel(role: Role, { req }: GetServerSidePropsContext) {
  const user = req.session.user;

  let redirect = false;
  if (!user) redirect = true;
  if (role === "admin" && !user?.admin) redirect = true;

  if (redirect)
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  else
    return {
      props: { ...user },
    };
}
