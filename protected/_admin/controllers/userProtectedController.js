import { $aux_view_showError } from "../../../view/errorView.js";
import { api_createNewUser } from "../model/userProtectedModel.js";
import { $aux_view_showCreateNewUserResult } from "../view/userProtectedView.js";

export async function uc_createNewUser() {
    document.getElementById("form-newUser").addEventListener("submit", async (e) => {
        e.preventDefault();

        const newUserRole = await defineRole(document.getElementById("newUser-role").value);

        if (newUserRole === false) {
            $aux_view_showError("Por favor, defina el rol correctamente: Estudiante, Docente o Administrador.");
            return;
        }

        const newUser = {
            firstName: document.getElementById("newUser-firstName").value,
            lastName: document.getElementById("newUser-lastName").value,
            document: document.getElementById("newUser-document").value,
            loginId: document.getElementById("newUser-loginId").value,
            password: document.getElementById("newUser-password").value,
            role: newUserRole,
        }

        const res = await api_createNewUser(newUser);

        if (res.error) {
            $aux_view_showError(res.error);
        } else {
            $aux_view_showCreateNewUserResult(res.message);
        }
    })
}

async function defineRole(role) {
    switch (role) {
        case "Estudiante":
            return "STUDENT";
        
        case "Docente":
            return "PROFESSOR";

        case "Administrador":
            return "ADMIN";

        default:
            return false;
    }
}