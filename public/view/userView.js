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

export async function view_showActiveUserData(data, container, columns) {
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("width", "32");
    icon.setAttribute("height", "32");
    icon.setAttribute("fill", "currentColor");
    icon.setAttribute("viewBox", "0 0 16 16");
    icon.innerHTML = `<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>`;
    container.appendChild(icon)

    for (const [key, val] of Object.entries(data)) {
        let datum = document.createElement('span');
        datum.textContent = val;
        columns.appendChild(datum);
    }
    
    const logoutButton = document.createElement('button');
    logoutButton.id = "logout";
    logoutButton.textContent = "Cerrar Sesión"
    container.appendChild(logoutButton);
}

export async function view_showLoginButton(flag) {
    console.log("\n")
    console.log("Calling view_showLoginButton view...")
    if (flag === "INACTIVE") {
        const buttonContainer = document.getElementById("active-user-data");
        const newButton = document.createElement("a");
        newButton.textContent = "Iniciar Sesión";
        newButton.href = "./login.html";
        buttonContainer.appendChild(newButton);
    } else { return; }
}

export async function view_activeSidebarSelection() {
    const currentPath = window.location.pathname;

    document.querySelectorAll(".sidebar-item").forEach(link => {
        if (link.pathname === currentPath) {
            link.classList.add("active");
        }
    });
}