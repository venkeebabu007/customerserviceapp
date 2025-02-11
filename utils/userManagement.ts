import { createClient } from "@/utils/supabase/server"

export async function createUser(email: string, password: string, name: string, role: "agent" | "manager" | "admin") {
  const supabase = createClient()

  // Create user in Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    console.error("Error creating auth user:", authError)
    return null
  }

  // Insert user into users_csapp table
  const { data: dbUser, error: dbError } = await supabase
    .from("users_csapp")
    .insert({
      auth_user_id: authUser.user.id,
      name,
      email,
      role,
      is_active: true,
    })
    .single()

  if (dbError) {
    console.error("Error inserting user into users_csapp:", dbError)
    return null
  }

  return dbUser
}

export async function createSampleUser() {
  return await createUser("testuser@example.com", "testpassword123", "Test User", "agent")
}

