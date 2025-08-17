import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  console.log("Auth callback received:", {
    code: !!code,
    error,
    errorDescription,
  });

  // 如果有错误，重定向到调试页面
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      `${origin}/auth-debug?error=${encodeURIComponent(
        error
      )}&error_description=${encodeURIComponent(errorDescription || "")}`
    );
  }

  if (code) {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          `${origin}/auth-debug?error=exchange_error&error_description=${encodeURIComponent(
            error.message
          )}`
        );
      }

      console.log("Auth exchange successful for user:", data.user?.email);
    } catch (err: any) {
      console.error("Unexpected error during code exchange:", err);
      return NextResponse.redirect(
        `${origin}/auth-debug?error=unexpected_error&error_description=${encodeURIComponent(
          err.message
        )}`
      );
    }
  }

  // 成功登录后重定向到仪表板
  return NextResponse.redirect(`${origin}/dashboard`);
}
