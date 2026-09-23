// Backend

import fs from 'fs';

export async function sendProfessorData(req, res) { // [HU-03]
    console.log("\n");
    console.log("Register / Update professor data.");
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
    } = req.body;

    console.log("Reading professor data...");
    const profList = JSON.parse(
        fs.readFileSync('./server/data/professorData.json')
    );

    const existingIndex = profList.findIndex(user => user.loginId === loginId);

    const professorData = {
        loginId,
        firstName,
        lastName,
        birthDate,
        gender,
        address,
        phoneNumber,
        mobileNumber,
        email
    };

    if (existingIndex !== -1) {
        console.log(`Updating existing professor with loginId: ${loginId}`);
        profList[existingIndex] = professorData;
    } else {
        console.log(`Adding new professor with loginId: ${loginId}`);
        profList.push(professorData);
    }

    console.log("Saving professor data JSON...");
    fs.writeFileSync('./server/data/professorData.json', JSON.stringify(profList, null, 4));

    console.log("Professor data saved successfully");
    res.json({
        message: existingIndex !== -1 
            ? "Datos personales del profesor actualizados correctamente." 
            : "Datos personales del profesor guardados correctamente."
    });
}

export async function sendProfessorDegreeData(req, res) { // [HU-04]
    console.log("\n");
    console.log("Register / Update professor academic degree data.");

    const {
        loginId,
        continuingEducation,
        postgraduateDegrees
    } = req.body;

    // Validación de posgrados incompletos (se mantiene)
    const tienePostgradoIncompleto = (postgraduateDegrees || []).some(
        posgrado => !posgrado.thesisTitle || !posgrado.thesisAdvisor
    );

    if (tienePostgradoIncompleto) {
        console.log("Missing thesis data in a postgraduate record.");
        return res.status(400).json({
            error: "Cada posgrado debe incluir el título de la tesis y el director de tesis."
        });
    }

    console.log("Reading professor degree data...");
    const degreeList = JSON.parse(
        fs.readFileSync('./server/data/professorDegreeData.json')
    );

    const existingIndex = degreeList.findIndex(record => record.loginId === loginId);

    const updatedDegreeRecord = {
        loginId,
        continuingEducation: continuingEducation || [],
        postgraduateDegrees: postgraduateDegrees || []
    };

    if (existingIndex !== -1) {
        console.log(`Updating degree data for loginId: ${loginId}`);
        degreeList[existingIndex] = updatedDegreeRecord;
    } else {
        console.log(`Adding new degree data for loginId: ${loginId}`);
        degreeList.push(updatedDegreeRecord);
    }

    console.log("Saving professor degree data JSON...");
    fs.writeFileSync('./server/data/professorDegreeData.json', JSON.stringify(degreeList, null, 4));

    console.log("Professor degree data saved successfully");
    res.json({
        message: existingIndex !== -1 
            ? "Información académica actualizada correctamente." 
            : "Información académica guardada correctamente."
    });
}

export async function sendProfessorClassData(req, res) { // [HU-05]
console.log("\n");
    console.log("Register / Update professor teachable subjects.");

    const {
        loginId,
        subjects
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

    const existingIndex = classList.findIndex(record => record.loginId === loginId);

    const updatedClassRecord = {
        loginId,
        subjects
    };

    if (existingIndex !== -1) {
        console.log(`Updating subjects for loginId: ${loginId}`);
        classList[existingIndex] = updatedClassRecord;
    } else {
        console.log(`Adding new subjects for loginId: ${loginId}`);
        classList.push(updatedClassRecord);
    }

    console.log("Saving professor class data JSON...");
    fs.writeFileSync('./server/data/professorClassData.json', JSON.stringify(classList, null, 4));

    console.log("Professor class data saved successfully");
    res.json({
        message: existingIndex !== -1 
            ? "Temáticas del docente actualizadas correctamente." 
            : "Temáticas del docente guardadas correctamente."
    });
}