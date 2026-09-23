// Backend

import fs from 'fs';

export async function sendProfessorData(req, res) { // [HU-03]
    console.log("\n");
    console.log("Register professor data.");
    const {
        loginId,
        firstName,
        lastName,
        birthDate,
        gender,
        address,
        phoneNumber,
        mobileNumber,
        email,
    } = req.body

    console.log("Reading professor data...");
    const profList = JSON.parse(
        fs.readFileSync('./server/data/professorData.json')
    );

    const isLoginIdDuplicated = profList.find(user => user.loginId === loginId);

    if (isLoginIdDuplicated) {
        console.log("loginId already exists, cannot write professor data.")
        return res.status(400).json({
            error: "El ID de inicio de sesión ya existe. Por favor, ingrese un nuevo ID."
        })
    }

    console.log("loginId is new.");
    const newProfessor = {
        loginId: loginId,
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        gender: gender,
        address: address,
        phoneNumber: phoneNumber,
        mobileNumber: mobileNumber,
        email: email
    }

    profList.push(newProfessor);

    console.log("Saving professor data JSON...");
    fs.writeFileSync('./server/data/professorData.json', JSON.stringify(profList, null, 4));

    console.log("Professor data saved successfully");
    res.json({
        message: "Datos personales del profesor guardados."
    });
}

export async function sendProfessorDegreeData(req, res) { // [HU-04]
    console.log("\n");
    console.log("Register professor academic degree data.");

    const {
        loginId,
        continuingEducation, // [{ type: 'curso' | 'seminario' | 'diplomado', name, completionDate }]
        postgraduateDegrees  // [{ type: 'especializacion' | 'maestria' | 'doctorado', name, completionDate, thesisTitle, thesisAdvisor }]
    } = req.body;

    console.log("Reading professor degree data...");
    const degreeList = JSON.parse(
        fs.readFileSync('./server/data/professorDegreeData.json')
    );

    const isLoginIdDuplicated = degreeList.find(record => record.loginId === loginId);

    if (isLoginIdDuplicated) {
        console.log("loginId already has degree data registered.");
        return res.status(400).json({
            error: "Este docente ya tiene información académica registrada. Considere actualizarla en su lugar."
        });
    }

    // validación los posgrados deben traer título y director de tesis
    const tienePostgradoIncompleto = (postgraduateDegrees || []).some(
        posgrado => !posgrado.thesisTitle || !posgrado.thesisAdvisor
    );

    if (tienePostgradoIncompleto) {
        console.log("Missing thesis data in a postgraduate record.");
        return res.status(400).json({
            error: "Cada posgrado debe incluir el título de la tesis y el director de tesis."
        });
    }

    console.log("loginId is new for degree data.");
    const newDegreeRecord = {
        loginId,
        continuingEducation: continuingEducation || [],
        postgraduateDegrees: postgraduateDegrees || []
    };

    degreeList.push(newDegreeRecord);

    console.log("Saving professor degree data JSON...");
    fs.writeFileSync('./server/data/professorDegreeData.json', JSON.stringify(degreeList, null, 4));

    console.log("Professor degree data saved successfully");
    res.json({
        message: "Información académica y de posgrado guardada correctamente."
    });
}

export async function sendProfessorClassData(req, res) { // [HU-05]
    console.log("\n");
    console.log("Register professor teachable subjects.");

    const {
        loginId,
        subjects // ["Bases de Datos", "Estructuras de Datos", "Redes", "Inteligencia Artificial"]
    } = req.body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
        console.log("No subjects provided.");
        return res.status(400).json({
            error: "Debe ingresar al menos una temática que el docente pueda dictar."
        });
    }

    if (subjects.length > 4) {
        console.log("Too many subjects provided:", subjects.length);
        return res.status(400).json({
            error: "Solo se permiten un máximo de 4 temáticas, en orden de mayor a menor experiencia."
        });
    }

    console.log("Reading professor class data...");
    const classList = JSON.parse(
        fs.readFileSync('./server/data/professorClassData.json')
    );

    const isLoginIdDuplicated = classList.find(record => record.loginId === loginId);

    if (isLoginIdDuplicated) {
        console.log("loginId already has class data registered.");
        return res.status(400).json({
            error: "Este docente ya tiene temáticas registradas. Considere actualizarlas en su lugar."
        });
    }

    console.log("loginId is new for class data.");
    const newClassRecord = {
        loginId,
        subjects // se guarda en el mismo orden recibido, de mayor a menor experiencia
    };

    classList.push(newClassRecord);

    console.log("Saving professor class data JSON...");
    fs.writeFileSync('./server/data/professorClassData.json', JSON.stringify(classList, null, 4));

    console.log("Professor class data saved successfully");
    res.json({
        message: "Temáticas del docente guardadas correctamente."
    });
}