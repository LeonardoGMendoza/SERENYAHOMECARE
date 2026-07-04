import withAuth from "next-auth/middleware";

export default function proxy(req, event) {
  return withAuth(req, event);
}

export const config = {
  matcher: ["/dashboard/((?!login).*)"],
};
