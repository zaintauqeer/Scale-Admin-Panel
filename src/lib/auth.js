"use server";

import { signIn } from "@/auth";

export async function loginAction(formData) {
  try {
    const identifier = formData.get("identifier");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      redirect: false, // Prevent automatic redirect
      identifier,
      password,
    });

    if (res?.error) {
      return { error: "Invalid credentials" };
    }

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}