import crypto from 'crypto';

export default class TrainingParticipant {
    #id;
    #trainingId;
    #firstName;
    #lastName;
    #phoneNumber;
    #address;
    #type;

    instanceCreate({ trainingId, firstName, lastName, phoneNumber, address, type }) {
        this.#id = crypto.randomUUID();
        this.#trainingId = trainingId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#phoneNumber = phoneNumber;
        this.#address = address;
        this.#type = type;
    }

    instanceLoad(data) {
        this.#id = data.id;
        this.#trainingId = data.trainingId;
        this.#firstName = data.firstName;
        this.#lastName = data.lastName;
        this.#phoneNumber = data.phoneNumber;
        this.#address = data.address;
        this.#type = data.type;
    }

    updateData({ firstName, lastName, phoneNumber, address, type }) {
        if (firstName !== undefined) this.#firstName = firstName;
        if (lastName !== undefined) this.#lastName = lastName;
        if (phoneNumber !== undefined) this.#phoneNumber = phoneNumber;
        if (address !== undefined) this.#address = address;
        if (type !== undefined) this.#type = type;
        // id y trainingId nunca se modifican aquí
    }

    get id() { return this.#id; }
    get trainingId() { return this.#trainingId; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get phoneNumber() { return this.#phoneNumber; }
    get address() { return this.#address; }
    get type() { return this.#type; }

    toJSON() {
        return {
            id: this.#id,
            trainingId: this.#trainingId,
            firstName: this.#firstName,
            lastName: this.#lastName,
            phoneNumber: this.#phoneNumber,
            address: this.#address,
            type: this.#type
        };
    }
}