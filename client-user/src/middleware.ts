//   import { NextResponse } from "next/server";
//   import { isAuthenticated } from "@/helpers/authHelper";

//   export default function middleware(req: any) {
//     const url = req.url;

//     // List of routes that are accessible without authentication
//     const allowedRoutes = ["/auth", "/login"];

//     // Check if the user is authenticated
//     const authenticated = isAuthenticated();

//     // If the route requires authentication and the user is not authenticated, redirect to the login page
//     if (!authenticated && !allowedRoutes.includes(url)) {
//       return NextResponse.redirect("/login");
//     }

//     // If the user is authenticated and trying to access the login page, redirect to the home page
//     if (authenticated && url === "/login") {
//       return NextResponse.redirect("/");
//     }

//     // If the user is authenticated and trying to access any other restricted page, redirect to the home page or show an error message
//     if (authenticated && !allowedRoutes.includes(url)) {
//       // You can choose to redirect the user to the home page or show an error message
//       return NextResponse.redirect("/");
//       // return NextResponse.error(new Error("Unauthorized access"));
//     }
//   }
import { NextResponse } from "next/server";

export default function middleware(req: any) {
  // let verify = req.cookies.get("loggedin");
  // let url = req.url;
  // if (!verify && url.includes("/auth")) {
  //   return NextResponse.redirect("https://dev.client.domain/");
  // }
  // if (
  //   (verify && url === "https://dev.client.domain/") ||
  //   url === "https://dev.client.domain/signup"
  // ) {
  //   return NextResponse.redirect("https://dev.client.domain/auth");
  // }
}
