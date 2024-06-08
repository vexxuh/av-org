import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/dashboard(.*)",
  "/:id/edit(.*)",
  "/detailed-add",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  if (
    (req.url.includes("/login") || req.url.includes("/signup")) &&
    auth().userId
  )
    return NextResponse.redirect(new URL("/", req.url));
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
