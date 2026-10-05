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

export function requiresPermission(module, action) {
    return async function (req, res, next) {
        if (!req.session || !req.session.usuarioId || !req.session.roleId) {
            return res.status(401).json({
                mensaje: "Debes iniciar sesión para realizar esta acción."
            });
        }

        try {
            // Leer roles dinámicos
            console.log("\n")
            console.log("Start permission check.")
            const roleData = await fs.readFile('./server/data/roleData.json', 'utf-8');
            const roleList = JSON.parse(roleData);

            const userRole = roleList.find(r => r.roleId === req.session.roleId);

            if (!userRole) {
                return res.status(403).json({ mensaje: "El rol asignado no existe o no es válido." });
            }

            const perms = userRole.permissions || {};

            // 1. El Administrador General tiene acceso total
            if (perms.all && perms.all.includes("admin")) {
                return next();
            }

            // 2. Verificar permiso específico sobre el módulo
            const modulePerms = perms[module] || [];

            // Si es administrador del módulo o posee la acción solicitada (read/write)
            const tieneAcceso = modulePerms.includes("admin") || modulePerms.includes(action);

            if (!tieneAcceso) {
                console.log(`Access denied for '${req.session.usuarioId}' in module '${module}' for action '${action}'`);
                return res.status(403).json({
                    mensaje: `No tienes permisos de ${accionRequerida === 'write' ? 'escritura/actualización' : 'consulta'} en el módulo de ${module}.`
                });
            }

            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({ mensaje: "Error interno verificando permisos." });
        }
    };
}