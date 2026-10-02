export default class Class {
    #studentId; // should be loginId from instance of User class.
    #classId;
    #gradeLevel;
    #term1 = [0, 0, 0, 0, 0];
    #term1final = 0;
    #term2 = [0, 0, 0, 0, 0];
    #term2final = 0;
    #term3 = [0, 0, 0, 0, 0];
    #term3final = 0;
    #totalTermGrades = [0, 0, 0];
    #finalWeightedAverage = 0;

    set studentId(studentId) {
        this.#studentId = studentId;
    }

    set classId(classId) {
        this.#classId = classId;
    }

    set gradeLevel(gradeLevel) {
        this.#gradeLevel = gradeLevel;
    }

    set term1(term1) {
        this.#term1 = term1;
    }
    
    set term1final(term1final) {
        this.#term1final = term1final;
    }

    set term1(term2) {
        this.#term2 = term2;
    }
    
    set term2final(term2final) {
        this.#term2final = term2final;
    }

    set term3(term3) {
        this.#term3 = term3;
    }
    
    set term3final(term3final) {
        this.#term3final = term3final;
    }

    set totalTermGrades(totalTermGrades) {
        this.#totalTermGrades = totalTermGrades;
    }

    set finalWeightedAverage(finalWeightedAverage) {
        this.#finalWeightedAverage = finalWeightedAverage;
    }

    get studentId() {
        return this.#studentId;
    }

    get classId() {
        return this.#classId
    }

    get gradeLevel() {
        return this.#gradeLevel;
    }

    get term1() {
        return this.#term1;
    }
    
    get term1final() {
        return this.#term1final;
    }

    get term2() {
        return this.#term2;
    }
    
    get term2final() {
        return this.#term2final;
    }

    get term3() {
        return this.#term3;
    }
    
    get term3final() {
        return this.#term3final;
    }

    get totalTermGrades() {
        return this.#totalTermGrades;
    }

    get finalWeightedAverage() {
        return this.#finalWeightedAverage;
    }

    calcTerm1Total() {
        let total = 0
        for (let i of this.#term1) {
            total += (i*0.15)
        }
        total += (this.#term1final*0.25);
        this.#totalTermGrades[0] = total;
    }

    calcTerm2Total() {
        let total = 0
        for (let i of this.#term2) {
            total += (i*0.15)
        }
        total += (this.#term2final*0.25);
        this.#totalTermGrades[1] = total;
    }

    calcTerm3Total() {
        let total = 0
        for (let i of this.#term3) {
            total += (i*0.15)
        }
        total += (this.#term3final*0.25);
        this.#totalTermGrades[2] = total;
    }

    calcFinalWeightedAverage() {
        let total = 0;
        total += this.#totalTermGrades[0]*0.3
        total += this.#totalTermGrades[1]*0.3
        total += this.#totalTermGrades[2]*0.4
    }

    instanceReset() {
        this.#studentId = undefined;
        this.#classId = undefined;
        this.#term1 = [0, 0, 0, 0, 0];
        this.#term1final = 0;
        this.#term2 = [0, 0, 0, 0, 0];
        this.#term2final = 0;
        this.#term3 = [0, 0, 0, 0, 0];
        this.#term3final = 0;
        this.#totalTermGrades = [0, 0, 0];
        this.#finalWeightedAverage = 0;
    }
}