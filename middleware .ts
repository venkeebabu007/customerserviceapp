import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from '@/utils/supabase/middleware'


export async function middleware(req: NextRequest) {
  return await updateSession(req)
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req, res })
// console.log("it is coming to midllr")
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   console.log(user)

//   if (!user && !req.nextUrl.pathname.startsWith("/login")) {
//     return NextResponse.redirect(new URL("/login", req.url))
//   }

//   if (user && req.nextUrl.pathname.startsWith("/admin")) {
//     const { data: userData } = await supabase.from("users_csapp").select("role").eq("auth_user_id", user.id).single()

//     if (userData?.role !== "admin") {
//       return NextResponse.redirect(new URL("/", req.url))
//     }
//   }

//   return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

