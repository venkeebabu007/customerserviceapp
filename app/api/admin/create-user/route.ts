import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json()

  // Create a Supabase client
  const supabase = createRouteHandlerClient({ cookies })

  // Check if the current user is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { data: userData, error: userError } = await supabase
    .from("users_csapp")
    .select("role")
    .eq("auth_user_id", user.id)
    .single()

  if (userError || userData?.role !== "admin") {
    console.log("User role check failed:", userError || "Not an admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) throw error

    if (data.user) {
      // Insert the user into your custom users_csapp table
      const { error: insertError } = await supabase.from("users_csapp").insert({
        auth_user_id: data.user.id,
        name,
        email,
        role,
        is_active: true,
      })

      if (insertError) throw insertError

      return NextResponse.json({ message: "User created successfully" }, { status: 200 })
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

