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
        loginId: foundUser.loginId,
    }

    console.log("Creating user instance...");
    activeUser.instanceLogin(loginData);

    console.log("Creating user session...")
    req.session.loggedId = activeUser.loginId;
    req.session.role = activeUser.role;
    console.log(`Session: ${req.session.loggedId}`);
    console.log(`Role: ${req.session.role}`);

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
            fullName: (activeUser.firstName + " " + activeUser.lastName),
            role: activeUser.role
        })
    } else {
        console.log("Unexpected attempt to get active user data without an active session (?)");
        res.status(401).json({
            error: "No se pueden obtener los datos del usuario: no hay sesión activa."
        })
    }
}

export async function admin_requestCreateNewUser(req, res) { // [HU-13; 14; 15; 16]
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

    console.log("loginId is new.");
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        document: document,
        loginId: loginId,
        role: role,
    }

    console.log("Checking role validity...");
    const roleValidity = await isRoleValid(newUser.role);
    
    if (roleValidity) {
        console.log("Role is valid.");
    } else {
        console.log("Role is not valid.");
        return res.status(400).json({
            error: "El rol ingresado no es válido."
        })
    }

    console.log("Hashing password.");
    newUser.password = await bcrypt.hash(password, 12);
    console.log("Password hashed.");

    userList.push(newUser);

    console.log("Saving user data JSON...");
    fs.writeFileSync('./server/data/userData.json', JSON.stringify(userList, null, 4));

    console.log("User data saved successfully");
    res.json({
        message: "Usuario creado correctamente."
    });
}

export async function admin_requestUpdateUser(req, res) { // [HU-XX]
    console.log("\n");
    console.log("Admin: Request user update.");

    const {
        loginId,       // identifica QUÉ usuario se va a modificar — obligatorio
        firstName,
        lastName,
        document,
        newLoginId,    // opcional: si el admin quiere CAMBIAR el loginId
        role,
        password       // opcional: solo si se va a cambiar la contraseña
    } = req.body;

    if (!loginId) {
        console.log("Error: No loginId provided to identify the user.");
        return res.status(400).json({
            error: "Se requiere el ID de inicio de sesión del usuario a modificar."
        });
    }

    const userList = JSON.parse(
        fs.readFileSync('./server/data/userData.json')
    );

    const userIndex = userList.findIndex(user => user.loginId === loginId);

    if (userIndex === -1) {
        console.log("User not found, cannot update.");
        return res.status(404).json({
            error: "No se encontró ningún usuario con ese ID de inicio de sesión."
        });
    }

    const existingUser = userList[userIndex];

    // Si se quiere cambiar el loginId, verificar que el NUEVO valor no choque con OTRO usuario
    if (newLoginId && newLoginId !== loginId) {
        console.log("Checking if new loginId is already taken by another user...");
        const isNewLoginIdTaken = userList.some(
            user => user.loginId === newLoginId && user.loginId !== loginId
        );

        if (isNewLoginIdTaken) {
            console.log("New loginId already exists, cannot update.");
            return res.status(400).json({
                error: "El nuevo ID de inicio de sesión ya está en uso por otro usuario."
            });
        }
    }

    // Validar el rol SOLO si se envió uno nuevo
    if (role !== undefined) {
        console.log("Checking role validity...");
        const roleValidity = await isRoleValid(role);

        if (!roleValidity) {
            console.log("Role is not valid.");
            return res.status(400).json({
                error: "El rol ingresado no es válido."
            });
        }
    }

    console.log("Applying updates...");
    const updatedUser = {
        ...existingUser,
        firstName: firstName !== undefined ? firstName : existingUser.firstName,
        lastName: lastName !== undefined ? lastName : existingUser.lastName,
        document: document !== undefined ? document : existingUser.document,
        loginId: newLoginId !== undefined ? newLoginId : existingUser.loginId,
        role: role !== undefined ? role : existingUser.role,
    };

    // La contraseña se re-hashea SOLO si se envió una nueva
    if (password !== undefined) {
        console.log("New password provided, hashing...");
        updatedUser.password = await bcrypt.hash(password, 12);
        console.log("Password hashed.");
    }
    // si no se envió password, updatedUser.password ya quedó igual al existente, por el spread inicial

    userList[userIndex] = updatedUser; // reemplaza SOLO ese registro, en su misma posición

    console.log("Saving user data JSON...");
    fs.writeFileSync('./server/data/userData.json', JSON.stringify(userList, null, 4));

    console.log("User data updated successfully");
    res.json({
        message: "Usuario actualizado correctamente."
    });
}

export async function admin_findUsersByName(req, res) {
    console.log("\n");
    console.log("Admin: Request list of user by chars: ")
    
    const {
        charsToFind
    } = req.body

    console.log("Searching for: " + charsToFind);

    if (charsToFind === undefined || charsToFind === "" || charsToFind === Number(charsToFind) || charsToFind === " ") {
        console.log("Bad search request.");
        return res.status(400).json({
            error: "Por favor ingrese caracteres válidos."
        });
    }

    const charsFilter = charsToFind.trim().toLowerCase().split(/\s+/); // Usar >=1 espacios como separador
    console.log("Filtered chars: " + charsFilter)

    const userList = JSON.parse(
        fs.readFileSync('./server/data/userData.json')
    );

    const foundUsers = userList.filter(user => {
        const fullName = `${user.name} ${user.lastname}`.toLowerCase(); // Armar string de nombres y apellidos
        return charsFilter.every(word => fullName.includes(word)); // Comparar con array de input creado
    });

    foundUsers.forEach(foundUser => {
        foundUser.password = undefined; // sudo apt install opsec
    });

    console.log("Found users: " + foundUsers);

    if (!foundUsers) {
        console.log("Unsuccesful search.");
        return res.json ({
            message: "No se encontró ningún usuario."
        })
    } else {
        console.log("Succesful search.");
        res.json({
            message: foundUsers
        })
    }
}

async function isRoleValid(role) {
    switch (role) {
        case "STUDENT": return true;
        case "PROFESSOR": return true;
        case "ADMIN": return true;
        default: return false;
    }
}