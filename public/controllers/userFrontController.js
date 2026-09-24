import { api_sendLoginRequest } from "../model/userFront.js";
import { $aux_view_showError } from "../view/errorView.js";
import { $aux_view_showLoginResult } from "../view/userView.js";

export async function uc_login() {
    console.log("\n");
    console.log("Frontend login request...")
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = {
            userLoginId: document.getElementById("userLoginId").value,
            userLoginPassword: document.getElementById("userLoginPassword").value
        }

        const res = await api_sendLoginRequest(user);

        if (res.error) {
            $aux_view_showError(res.error)
        } else {
            $aux_view_showLoginResult(res.message)
        }
    })
}