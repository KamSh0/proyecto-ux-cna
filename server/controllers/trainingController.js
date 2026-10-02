import fs from 'fs';
import Training from '../classes/Training.js';
import TrainingParticipant from '../classes/TrainingParticipant.js';

const TRAINING_DATA_PATH = './server/data/trainingData.json';
const PARTICIPANTS_DATA_PATH = './server/data/trainingParticipantsData.json';

export async function createTraining(req, res) {
    const { topicInfo, date, location, hours } = req.body;

    const trainingList = JSON.parse(fs.readFileSync(TRAINING_DATA_PATH));

    const training = new Training();
    training.instanceCreate({ topicInfo, date, location, hours }); // siempre genera un id nuevo

    trainingList.push(training.toJSON()); // SOLO agrega, nunca reemplaza nada existente

    fs.writeFileSync(TRAINING_DATA_PATH, JSON.stringify(trainingList, null, 4));

    res.json({
        message: "Capacitación creada correctamente.",
        training: training.toJSON()
    });
}

export async function updateTraining(req, res) {
    const { id, topicInfo, date, location, hours, status } = req.body;

    if (!id) {
        return res.status(400).json({
            error: "Se requiere el ID de la capacitación para actualizarla."
        });
    }

    const trainingList = JSON.parse(fs.readFileSync(TRAINING_DATA_PATH));
    const index = trainingList.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "No se encontró ninguna capacitación con ese ID. No se puede actualizar un registro inexistente."
        });
    }

    const training = new Training();
    training.instanceLoad(trainingList[index]); // carga el registro EXISTENTE
    training.updateData({ topicInfo, date, location, hours, status }); // modifica solo lo recibido

    trainingList[index] = training.toJSON(); // reemplaza ÚNICAMENTE ese registro, en su misma posición

    fs.writeFileSync(TRAINING_DATA_PATH, JSON.stringify(trainingList, null, 4));

    res.json({
        message: "Capacitación actualizada correctamente.",
        training: training.toJSON()
    });
}


export async function addTrainingParticipant(req, res) {
    const { trainingId, firstName, lastName, phoneNumber, address, type } = req.body;

    // Valida que la capacitación referenciada exista antes de asociarle un participante
    const trainingList = JSON.parse(fs.readFileSync(TRAINING_DATA_PATH));
    const trainingExists = trainingList.find(t => t.id === trainingId);

    if (!trainingExists) {
        return res.status(404).json({
            error: "No existe ninguna capacitación con ese ID."
        });
    }

    const participantsList = JSON.parse(fs.readFileSync(PARTICIPANTS_DATA_PATH));

    const participant = new TrainingParticipant();
    participant.instanceCreate({ trainingId, firstName, lastName, phoneNumber, address, type });

    participantsList.push(participant.toJSON()); // SIEMPRE agrega uno nuevo

    fs.writeFileSync(PARTICIPANTS_DATA_PATH, JSON.stringify(participantsList, null, 4));

    res.json({
        message: "Participante registrado correctamente.",
        participant: participant.toJSON()
    });
}

export async function updateTrainingParticipant(req, res) {
    const { id, firstName, lastName, phoneNumber, address, type } = req.body;

    if (!id) {
        return res.status(400).json({
            error: "Se requiere el ID del participante para actualizarlo."
        });
    }

    const participantsList = JSON.parse(fs.readFileSync(PARTICIPANTS_DATA_PATH));
    const index = participantsList.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "No se encontró ningún participante con ese ID."
        });
    }

    const participant = new TrainingParticipant();
    participant.instanceLoad(participantsList[index]);
    participant.updateData({ firstName, lastName, phoneNumber, address, type });

    participantsList[index] = participant.toJSON();

    fs.writeFileSync(PARTICIPANTS_DATA_PATH, JSON.stringify(participantsList, null, 4));

    res.json({
        message: "Participante actualizado correctamente.",
        participant: participant.toJSON()
    });
}

export async function getParticipantsByTraining(req, res) {
    const { trainingId } = req.params;

    const participantsList = JSON.parse(fs.readFileSync(PARTICIPANTS_DATA_PATH));
    const participantesDeEstaCapacitacion = participantsList.filter(p => p.trainingId === trainingId);

    res.json({ participantes: participantesDeEstaCapacitacion });
}