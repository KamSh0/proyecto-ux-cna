import crypto from 'crypto';

export default class Training {
    #id;
    #topicInfo;
    #date;
    #location;
    #hours;
    #status;
    #participants = [];

    // Usar SOLO para crear un registro nuevo — genera un id nuevo
    instanceCreate({ topicInfo, date, location, hours }) {
        this.#id = crypto.randomUUID();
        this.#topicInfo = topicInfo;
        this.#date = date;
        this.#location = location;
        this.#hours = hours;
        this.#status = 'programada';
    }

    // Usar para cargar un registro EXISTENTE desde el JSON, antes de modificarlo
    instanceLoad(data) {
        this.#id = data.id;
        this.#topicInfo = data.topicInfo;
        this.#date = data.date;
        this.#location = data.location;
        this.#hours = data.hours;
        this.#status = data.status;
    }

    // Modifica campos de un registro YA cargado — nunca toca el id
    updateData({ topicInfo, date, location, hours, status }) {
        if (topicInfo !== undefined) this.#topicInfo = topicInfo;
        if (date !== undefined) this.#date = date;
        if (location !== undefined) this.#location = location;
        if (hours !== undefined) this.#hours = hours;
        if (status !== undefined) this.#status = status;
    }

    addParticipant(participant) {
        this.#participants.push(participant);
    }

    removeParticipant(index) {
        this.#participants.splice(index, 1); // 👈 bug corregido
    }

    instanceReset() {
        this.#id = undefined;
        this.#topicInfo = undefined;
        this.#date = undefined;
        this.#location = undefined;
        this.#hours = undefined;
        this.#status = undefined;
        this.#participants = [];
    }

    get id() { return this.#id; }
    get topicInfo() { return this.#topicInfo; }
    get date() { return this.#date; }
    get location() { return this.#location; }
    get hours() { return this.#hours; }
    get status() { return this.#status; }

    // Necesario para que JSON.stringify() funcione correctamente
    toJSON() {
        return {
            id: this.#id,
            topicInfo: this.#topicInfo,
            date: this.#date,
            location: this.#location,
            hours: this.#hours,
            status: this.#status
        };
    }
}