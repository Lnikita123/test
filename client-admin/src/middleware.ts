import { NextResponse } from "next/server";

export default function middleware(req: any) {
  let verify = req.cookies.get("loggedin");
  let url = req.url;
  if (!verify && url.includes("/auth")) {
    return NextResponse.redirect("https://staging.admin.playalvis.com/");
  }
  if (verify && url === "https://staging.admin.playalvis.com/") {
    return NextResponse.redirect("https://staging.admin.playalvis.com/courses");
  }
}
