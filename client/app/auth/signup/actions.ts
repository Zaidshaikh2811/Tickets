"use server"


declare const process: { env: { NEXT_PUBLIC_BACKEND_URL?: string } };

export async function signUpAction(formData: FormData) {
    const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
    }

    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        })

        const data = await res.json().catch(() => null)


        if (!res.ok) {
            return {
                success: false,
                error: data?.message || "Sign up failed",
            }
        }

        return { ...data };
    } catch (err) {
        return {
            success: false,
            error: "Network error. Please try again.",
        }
    }
}