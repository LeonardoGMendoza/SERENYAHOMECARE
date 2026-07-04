export { default } from "next-auth/middleware";

export const config = {
  // Protege tudo dentro de /dashboard, EXCETO a própria página de login
  matcher: ["/dashboard/((?!login).*)"],
};
