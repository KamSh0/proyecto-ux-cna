export async function api_sendLoginRequest(user) {
    const res = await fetch('/api/user/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    }); 

    return res.json();
}

export async function api_getActiveUser() {
    const res = await fetch('/api/user/get-active-user', {
        method: "GET"
    });

    return res.json();
}