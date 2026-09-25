export function requiresRole(requiredRole) {
    return async function (req, res, next) {
        console.log("\n")
        console.log("Start login and role check");

        // 1. Verificar si hay sesión activa
        if (!req.session || !req.session.loggedId) {
            console.log("Not logged in");
            return res.status(401).json({
                error: "Debes iniciar sesión para realizar esta acción."
            });
        }

        // 2. Verificar si el usuario tiene el rol requerido
        if (req.session.role !== requiredRole) {
            console.log(`Access denied: Required role '${requiredRole}', got '${req.session.role}'`);
            return res.status(403).json({
                error: "No tienes los permisos necesarios para realizar esta acción."
            });
        }

        console.log(`Logged in as ${req.session.role} (next)`);
        next(); // Continuar a la siguiente función/controlador
    };
}