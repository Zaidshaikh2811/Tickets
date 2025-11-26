export async function apiFetch(path: string, options: RequestInit = {}) {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;

    const res = await fetch(`${base}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options,
    });

    let data = null;
    try {
        data = await res.json();

    } catch (e) { }

    return { res, data };
}
