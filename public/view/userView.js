export async function view_showLoginResult(msg) {
    alert(msg)
}

export async function $aux_view_showLoginResult(msg) {
    alert(msg);
}

export async function $aux_view_showActiveUserData(data, container) {
    for (const [key, val] of Object.entries(data)) {
        let datum = document.createElement('span');
        datum.textContent = val;
        container.appendChild(datum);
    }
}