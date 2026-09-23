export async function sendStudentData() { // [HU-01]
    console.log("\n");
    console.log("Register student data.");
    const {
        loginId,
        firstName,
        lastName,
        birthDate,
        gender,
        address,
        phoneNumber,
        email,
        disabilities,
        nSiblings,
        sports
    } = req.body

    console.log("Reading student data...");
    const studentList = JSON.parse(
        fs.readFileSync('./server/data/studentData.json')
    );

    const isLoginIdDuplicated = studentList.find(user => user.loginId === loginId);

    if (isLoginIdDuplicated) {
        console.log("loginId already exists, cannot write student data.")
        return res.status(400).json({
            error: "El ID de inicio de sesión ya existe. Por favor, ingrese un nuevo ID."
        })
    }

    console.log("loginId is new.");
    const newStudent = {
        loginId: loginId,
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        gender: gender,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        disabilities: disabilities,
        nSiblings: nSiblings,
        sports: sports
    }

    studentList.push(newStudent);

    console.log("Saving student data JSON...");
    fs.writeFileSync('./server/data/studentData.json', JSON.stringify(studentList, null, 4));

    console.log("student data saved successfully");
    res.json({
        message: "Datos personales del estudiante guardados."
    });
}

export async function sendStudentParentsData(req, res) { // [HU-02]
    console.log("\n");
    console.log("Register student parents data.");
    
    // Se espera que 'parents' sea un arreglo de objetos (ej: [ { father... }, { mother... } ])
    const { 
        loginId, 
        parents 
    } = req.body;

    // CA3: Validar que se haya ingresado la información de al menos un padre/acudiente
    if (!parents || !Array.isArray(parents) || parents.length === 0) {
        console.log("Validation failed: At least one parent or guardian is required.");
        return res.status(400).json({
            error: "Debe registrar la información de al menos uno de los padres o acudientes."
        });
    }

    // CA3 (Cont.): Validar que cada registro de padre tenga la información básica requerida
    for (const parent of parents) {
        if (!parent.profession || !parent.address || !parent.phoneNumber || !parent.mobilePhone || !parent.email) {
            console.log("Validation failed: Incomplete parent data.");
            return res.status(400).json({
                error: "Todos los campos (profesión, dirección, teléfono, teléfono móvil y correo electrónico) son requeridos para cada padre o acudiente."
            });
        }
    }

    console.log("Reading student parents data...");
    const parentsList = JSON.parse(
        fs.readFileSync('./server/data/studentParentsData.json')
    );

    // Verificar si ya existen registros previos para este estudiante
    const existingIndex = parentsList.findIndex(record => record.loginId === loginId);

    // Mapeo y estructuración limpia de los datos de cada padre (CA1 y CA2)
    const formattedParents = parents.map(parent => ({
        relationship: parent.relationship || "Acudiente", // ej: "Padre", "Madre", "Tutor"
        profession: parent.profession,
        address: parent.address,
        phoneNumber: parent.phoneNumber,
        mobilePhone: parent.mobilePhone,
        email: parent.email
    }));

    const newParentsRecord = {
        studentLoginId: loginId,
        parents: formattedParents,
        updatedAt: new Date().toISOString()
    };

    // Permitir visualización/edición reescribiendo si ya existe o agregando si es nuevo (CA1 y CA2)
    if (existingIndex !== -1) {
        console.log(`Updating existing parents record for student ${studentLoginId}...`);
        parentsList[existingIndex] = newParentsRecord;
    } else {
        console.log(`Adding new parents record for student ${studentLoginId}...`);
        parentsList.push(newParentsRecord);
    }

    console.log("Saving student parents data JSON...");
    fs.writeFileSync('./server/data/studentParentsData.json', JSON.stringify(parentsList, null, 4));

    console.log("Student parents data saved successfully.");
    return res.json({
        message: "Datos de los padres o acudientes guardados exitosamente."
    });
}