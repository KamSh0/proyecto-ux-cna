import { api_getActiveUser, api_sendLoginRequest } from "../model/userFront.js";
import { $aux_view_showError } from "../view/errorView.js";
import { $aux_view_showActiveUserData, $aux_view_showLoginResult, view_showActiveUserData } from "../view/userView.js";

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
            $aux_view_showError(res.error);
        } else {
            $aux_view_showLoginResult(res.message);
        }
    })
}

export async function uc_getActiveUserData() {
    const res = await api_getActiveUser();

    if (res.error) {
        console.log("Session does not exist.")
        return "INACTIVE";
    }

    const userInfo = document.getElementById("active-user-data");
    const userInfoColumns = document.getElementById("user-info-columns");

    view_showActiveUserData(res, userInfo, userInfoColumns);
}

export async function uc_logout(params) {
    
}