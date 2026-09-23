// Backend Grades controller [EP-03]
import fs from 'fs';
import { activeClass } from '../state/appState.js';

export async function findClassesByStudentId(req, res) {
    console.log("\n")
    console.log("Class data request (by studentId).");
    const {
        studentId,
    } = req.body

    console.log("Reading class & student data...");
    const classList = JSON.parse(
        fs.readFileSync('./server/data/classData.json')
    );

    const studentClasses = classList.filter(class_ => class_.studentId === studentId).classId;

    if (!studentClasses) {
        console.log("Error: Classes not found.")
        return res.status(401).json({
            error: "Las clases no han sido encontradas."
        })
    }

    console.log("Classes found.");

    res.json({
        message: studentClasses // this is an array
    });
}

async function findClassNames(classIdArray) {
    console.log("\n")
    console.log("Class name data request (by classId).");
    console.log("Reading class info...");
    const classInfoList = JSON.parse(
        fs.readFileSync('./server/data/classInfoData.json')
    );

    let classWithNames = [[]];

    for (let i in classIdArray) {
        classWithNames[i].push(classInfoList.filter(class_ => class_.classId === classIdArray[i]).classId);
        classWithNames[i].push(classInfoList.filter(class_ => class_.classId === classIdArray[i]).className);
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

