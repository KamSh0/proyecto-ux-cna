import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import bcrypt from 'bcrypt';

import { requestLogin, requestLogout, requestGetActiveUser, admin_requestCreateNewUser } from '../controllers/userController.js';
import { newMockReq, newMockRes } from './helpers/mockReqRes.js';
import { activeUser } from '../state/appState.js' 

vi.mock('fs'); // reemplaza fs con una versión falsa


describe('requestLogin', () => {
    let hashedPassword;

    beforeEach(async () => {
        vi.clearAllMocks();
        hashedPassword = await bcrypt.hash("123safepassword", 12);
    });

    it('reject if id does not match', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify([]))

        const req = newMockReq({body: {loginId: 1234321, password: "asdfghjkl"}});
        const res = newMockRes()

        await requestLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    })

    it('accept if password does match', async () => {

        fs.readFileSync.mockReturnValue(JSON.stringify([{
            firstname: "Jesus", lastname: "Christ", loginId: 1234321, password: hashedPassword
        }]))

        const req = newMockReq({body: {userLoginId: 1234321, userLoginPassword: "123safepassword"}});
        const res = newMockRes()

        await requestLogin(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining("exitoso")})
        );
    })

    it('reject if password does not match', async () => {

        fs.readFileSync.mockReturnValue(JSON.stringify([{
            firstname: "Jesus", lastname: "Christ", loginId: 1234321, password: hashedPassword
        }]))

        const req = newMockReq({body: {userLoginId: 1234321, userLoginPassword: "123unsafepassword"}});
        const res = newMockRes()

        await requestLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    })

})

describe('requestLogout', () => {
    let hashedPassword;

    beforeEach(async () => {
        vi.clearAllMocks();
        hashedPassword = await bcrypt.hash("123safepassword", 12);
    })

    it('attempt logout with an active session', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify([{
            firstname: "Jesus", lastname: "Christ", loginId: 1234321, password: hashedPassword
        }]))
        

        let req = newMockReq({body: {userLoginId: 1234321, userLoginPassword: "123safepassword"}});
        let res = newMockRes()

        await requestLogin(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({message: expect.stringContaining("exito")})
        );

        req.session.loggedId = 1234321
        res = newMockRes();

        await requestLogout(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({message: expect.stringContaining("exito")})
        );
    })

    it('attempt logout without an active session', async () => {
        const req = newMockReq();
        const res = newMockRes();

        await requestLogout(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    })
})

describe('getActiveUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        activeUser.instanceLogout();
    })

    it('get active user with an active session', async () => {
        activeUser.role = "ADMIN";

        const req = newMockReq({session: {loggedId: 67}})
        const res = newMockRes();

        await requestGetActiveUser(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({role: expect.stringContaining("ADMIN")})
        );
    })

    it('get active user data without an active session', async () => {
        activeUser.role = "ADMIN";

        const req = newMockReq();
        const res = newMockRes();

        await requestGetActiveUser(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
})

describe('admin_requestCreateNewUser', () => {
 
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(bcrypt, 'compare')
        vi.spyOn(bcrypt, 'hash')
    });
 
    it('create user when loginId does not exist', async () => {
        const usuariosExistentes = [
            { firstName: 'Ana', lastName: 'Gómez', document: '111', loginId: 'ana01', role: 'user', password: 'hash-viejo' }
        ];
 
        fs.readFileSync.mockReturnValue(JSON.stringify(usuariosExistentes));
        bcrypt.hash.mockResolvedValue('hash-simulado-123');
 
        const req = newMockReq({
            body: {
                firstName: 'foo',
                lastName: 'bar',
                document: '999',
                loginId: 'luis01',
                role: 'admin',
                password: 'claveSegura'
            }
        });
        const res = newMockRes();
 
        await admin_requestCreateNewUser(req, res);
 
        // 1. Se hasheó la contraseña con el password recibido, no en texto plano
        expect(bcrypt.hash).toHaveBeenCalledWith('claveSegura', 12);
 
        // 2. Se escribió el archivo con el usuario nuevo incluido
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
 
        const [rutaEscrita, contenidoEscrito] = fs.writeFileSync.mock.calls[0];
        expect(rutaEscrita).toBe('./server/data/userData.json');
 
        const usuariosGuardados = JSON.parse(contenidoEscrito);
        expect(usuariosGuardados).toHaveLength(2); // el existente + el nuevo
 
        const nuevoUsuarioGuardado = usuariosGuardados.find(u => u.loginId === 'luis01');
        expect(nuevoUsuarioGuardado).toBeDefined();
        expect(nuevoUsuarioGuardado.firstName).toBe('foo');
        expect(nuevoUsuarioGuardado.lastName).toBe('bar');
        expect(nuevoUsuarioGuardado.document).toBe('999');
        expect(nuevoUsuarioGuardado.role).toBe('admin');
 
        // 3. La contraseña guardada es el hash, NUNCA la contraseña en texto plano
        expect(nuevoUsuarioGuardado.password).toBe('hash-simulado-123');
        expect(nuevoUsuarioGuardado.password).not.toBe('claveSegura');
 
        // 4. Se respondió con éxito
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining('correctamente') })
        );
        expect(res.status).not.toHaveBeenCalled(); // nunca se llamó status(400) ni similar
    });
 
    it('reject creation if loginId already exists', async () => {
        const usuariosExistentes = [
            { firstName: 'a', lastName: 'g', document: '111', loginId: 'a01', role: 'user', password: 'hash-viejo' }
        ];
 
        fs.readFileSync.mockReturnValue(JSON.stringify(usuariosExistentes));
 
        const req = newMockReq({
            body: {
                firstName: 'Otro',
                lastName: 'Usuario',
                document: '222',
                loginId: 'a01', // mismo loginId que ya existe
                role: 'user',
                password: 'otraClave'
            }
        });
        const res = newMockRes();
 
        await admin_requestCreateNewUser(req, res);
 
        // No debe intentar hashear ni guardar nada
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
 
        // Debe responder con 400 y un mensaje de error claro
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: expect.stringContaining('ya existe') })
        );
    });
 
    it('do not include plaintext password at any point', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify([]));
        bcrypt.hash.mockResolvedValue('hash-simulado-456');
 
        const req = newMockReq({
            body: {
                firstName: 'c',
                lastName: 'r',
                document: '333',
                loginId: 'c01',
                role: 'user',
                password: 'passwordSecreta'
            }
        });
        const res = newMockRes();
 
        await admin_requestCreateNewUser(req, res);
 
        const respuestaJson = res.json.mock.calls[0][0];
        expect(JSON.stringify(respuestaJson)).not.toContain('passwordSecreta');
    });
 
    it('create first user when the list is empty', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify([])); // archivo vacío
 
        bcrypt.hash.mockResolvedValue('hash-primero');
 
        const req = newMockReq({
            body: {
                firstName: 'Primer',
                lastName: 'Usuario',
                document: '000',
                loginId: 'primero01',
                role: 'admin',
                password: 'clave123'
            }
        });
        const res = newMockRes();
 
        await admin_requestCreateNewUser(req, res);
 
        const contenidoEscrito = fs.writeFileSync.mock.calls[0][1];
        const usuariosGuardados = JSON.parse(contenidoEscrito);
 
        expect(usuariosGuardados).toHaveLength(1);
        expect(usuariosGuardados[0].loginId).toBe('primero01');
    });
 
});
 
