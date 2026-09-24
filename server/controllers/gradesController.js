// Backend Grades controller [EP-03]
import fs from 'fs/promises';
import { activeClass } from '../state/appState.js';

export async function findClassesByStudentId(req, res) {
    console.log("\n");
    console.log("Class data request (by studentId).");
    const { studentId } = req.body;

    if (!studentId) {
        return res.status(400).json({ error: "El studentId es requerido." });
    }

    try {
        // 1. Leer ambos archivos JSON de forma asíncrona y en paralelo
        const [classListRaw, classInfoRaw] = await Promise.all([
            fs.readFile('./server/data/classData.json', 'utf-8'),
            fs.readFile('./server/data/classInfoData.json', 'utf-8')
        ]);

        const classList = JSON.parse(classListRaw);
        const classInfoList = JSON.parse(classInfoRaw);

        // 2. Filtrar los IDs de las clases pertenecientes al estudiante
        const studentClassIds = classList
            .filter(item => item.studentId === studentId)
            .map(item => item.classId);

        if (studentClassIds.length === 0) {
            console.log("No classes found for this student.");
            return res.status(404).json({
                message: "No se encontraron clases para el estudiante ingresado.",
                classes: []
            });
        }

        // 3. Crear un Set para búsquedas de ID en tiempo constante O(1)
        const targetIds = new Set(studentClassIds);

        // 4. Cruzar la información con classInfoData de manera eficiente
        const classesWithNames = classInfoList
            .filter(info => targetIds.has(info.classId))
            .map(info => ({
                classId: info.classId,
                className: info.className
            }));

        console.log("Classes found successfully.");
        return res.json({
            classes: classesWithNames
        });

    } catch (error) {
        console.error("Error reading class files:", error);
        return res.status(500).json({ error: "Error interno del servidor al procesar las clases." });
    }
}

export async function findStudentsByClassId(req, res) { 
    console.log("\n")
    console.log("Student data request (by classId).");
    const {
        classId,
    } = req.body

    console.log("Reading class & student data...");
    const classList = JSON.parse(
        fs.readFileSync('./server/data/classData.json')
    );

    const classesStudents = classList.filter(class_ => class_.classId === classId).studentId;

    if (!classesStudents) {
        console.log("Error: Students not found.")
        return res.status(401).json({
            error: "Los estudiantes no han sido encontrados."
        })
    }

    console.log("Students found.");

    res.json({
        message: classesStudents // this is an array
    });
}

export async function sendGradesForTerm(req, res) { // [HU-06; 07]
    const {
        studentId,
        classId,
        term,
        isFinal,
        grades,
        finalGrade
    } = req.body

    for (let i of grades) {
        if (i < 0) {
            return res.status(401).json({
                error: "Calificación no válida. Por favor, ingrese calificaciones con valor positivo."
            })
        }
    }

    console.log("Reading class & student data...");
    const classList = JSON.parse(
        fs.readFileSync('./server/data/classData.json')
    );

    console.log("Searching class...")
    const selectedClass = classList.find(class_ => class_.studentId === studentId && class_.classId === classId);
    
    if (!selectedClass) {
        console.log("Error: class not found");
        return res.json({
            error: "No se ha podido encontrar la clase solicitada."
        })
    }
    
    console.log("Instancing class.");
    console.log("Selected class data: ");
    console.log(selectedClass);
    activeClass.studentId = selectedClass.studentId;
    activeClass.classId = selectedClass.classId;
    activeClass.term1 = selectedClass.term1;
    activeClass.term1final = selectedClass.term1final;
    activeClass.term2 = selectedClass.term2;
    activeClass.term2final = selectedClass.term2final;
    activeClass.term3 = selectedClass.term3;
    activeClass.term3final = selectedClass.term3final;
    activeClass.totalTermGrades = selectedClass.totalTermGrades;
    activeClass.finalWeightedAverage = selectedClass.finalWeightedAverage;

    console.log("Selecting grade.");
    switch (term) {
        case 1:
            if (isFinal) {
                activeClass.term1final = finalGrade;
            } else {
                activeClass.term1 = grades;
            }
            break;

        case 2:
            if (isFinal) {
                activeClass.term2final = finalGrade;
            } else {
                activeClass.term2 = grades;
            }
            break;

        case 3:
            if (isFinal) {
                activeClass.term2final = finalGrade;
            } else {
                activeClass.term2 = grades;
            }
            break;

        default:
            console.log("Invalid term.");
            activeClass.instanceReset();
            return res.status(401).json({
                error: "El periodo de seguimiento no ha sido encontrado. Por favor ingrese un periodo válido."
            })
    }
    console.log("Calculating totals...");
    activeClass.calcTerm1Total();
    activeClass.calcTerm2Total();
    activeClass.calcTerm3Total();

    const modifiedClass = {
        studentId: activeClass.studentId,
        classId: activeClass.classId,
        term1: activeClass.term1,
        term1final: activeClass.term1final,
        term2: activeClass.term2,
        term2final: activeClass.term2final,
        term3: activeClass.term3,
        term3final: activeClass.term3final,
        totalTermGrades: activeClass.totalTermGrades,
        finalWeightedAverage: activeClass.finalWeightedAverage
    }

    console.log("Modifiying selected class...");
    selectedClass = modifiedClass;

    console.log("Writing to JSON...")
    fs.writeFileSync(
        './server/data/classData.json',
        JSON.stringify(classList, null, 4)
    )
    
    console.log("Resetting instance...");
    activeClass.instanceReset();

    console.log("Grades modified successfully.");
    res.json({
        message: `La(s) calificación(es) ${grades}, para el periodo de seguimiento ${term}, del estudiante ${studentId} en la clase ${classId} han sido modificadas.`
    })
}

