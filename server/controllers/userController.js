// Backend User controller

import bcrypt from 'bcrypt';
import fs from 'fs';
import { activeUser } from '../state/appState.js';

export async function requestLogin(req, res) {
    console.log("\n");
    console.log("Login request.");
    const {
        userLoginId,
        userLoginPassword
    } = req.body;

    console.log("Reading user data...");
    const userList = JSON.parse(
        fs.readFileSync('./server/data/userData.json')
    );

    const foundUser = userList.find(user => user.loginId === userLoginId);

    if (!foundUser) {
        console.log("Error: User not found.")
        return res.status(401).json({
            error: "Usuario o contraseña incorrectos"
        })
    }

    console.log("User found. Comparing passwords...");
    const isCorrectPassword = await bcrypt.compare(
        userLoginPassword,
        foundUser.password
    )

    if (isCorrectPassword === false) {
        console.log("Error: Passwords do not match.");
        return res.status(401).json({
            error: "Usuario o contraseña incorrectos"
        });
    }

    console.log("Passwords match correctly.");
    const loginData = {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        document: foundUser.document,
        role: foundUser.role,
        loginId: foundUser.loginData,
    }

    console.log("Creating user instance...");
    activeUser.instanceLogin(loginData);

    console.log("Creating user session...")
    req.session.loggedId = activeUser.loginId;

    console.log("Logged in successfully.");
    return res.json({
        message: "Inicio de sesión exitoso"
    });
}

export async function requestLogout(req, res) {
    console.log("\n");
    console.log("Logout request.");
    if (req.session.loggedId) {
        req.session.destroy((err) => {
            if (err) {
                console.log("Logout error:", err);
                return res.status(500).json({ error: "No se pudo cerrar sesión" });
            }
            console.log("Logout successful. Deleting instance & cookie...");
            activeUser.instanceLogout();
            res.clearCookie('connect.sid');
            console.log("Logout successfully completed.")
            res.json({ message: "Sesión cerrada exitosamente" });
        });
    } else {
        console.log("Unexpected attempt to logout without an active session (?)");
        res.status(401).json({
            error: "Cierre de sesión fallido: No hay una sesión activa en este momento."
        })
    }

}

export async function requestGetActiveUser(req, res) {
    console.log("\n");
    console.log("Requesting active user data...");
    if (req.session.loggedId) {
        console.log("Data obtained.")
        res.json({
            firstName: activeUser.firstName,
            lastName: activeUser.lastName,
            document: activeUser.document,
            role: activeUser.role,
            loginId: activeUser.loginId
        })
    } else {
        console.log("Unexpected attempt to get active user data without an active session (?)");
        res.status(401).json({
            error: "No se pueden obtener los datos del usuario: no hay sesión activa."
        })
    }
}

export async function admin_requestCreateNewUser(req, res) {
    console.log("\n");
    console.log("Admin: Request new user creation.");
    const {
        firstName,
        lastName,
        document,
        loginId,
        role,
        password
    } = req.body;

    const userList = JSON.parse(
        fs.readFileSync('./server/data/userData.json')
    );

    const isLoginIdDuplicated = userList.find(user => user.loginId === loginId);

    if (isLoginIdDuplicated) {
        console.log("loginId already exists, cannot create user.")
        return res.status(400).json({
            error: "El ID de inicio de sesión ya existe. Por favor, ingrese un nuevo ID."
        })
    }

    console.log("loginId is new.")
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        document: document,
        loginId: loginId,
        role: role,
    }
    console.log("Hashing password.")
    newUser.password = await bcrypt.hash(password, 12);
    console.log("Password hashed.")

    userList.push(newUser);

    console.log("Saving user data JSON...");
    fs.writeFileSync('./server/data/userData.json', JSON.stringify(userList, null, 4));

    console.log("User data saved successfully");
    res.json({
        message: "Usuario creado correctamente."
    });
}