"use server"

export async function signInAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
        return { success: false, message: "Email and password are required" };
    }

    try {
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/signin`);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/signin`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || "Invalid credentials" };
        }

        return { ...data };
    } catch (error) {
        console.log(error);

        return { success: false, message: "Server unavailable, try again later" };
    }
}
