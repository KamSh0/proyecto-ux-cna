export async function api_createNewUser(newUser) {
    const res = await fetch('/api/user/admin/create-new-user', {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(newUser)
    })

    return res.json();
}