export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quests/:path*",
    "/habits/:path*",
    "/shop/:path*",
    "/stats/:path*",
  ],
};
