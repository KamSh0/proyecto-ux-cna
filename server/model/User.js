export default class User {
    #firstName;
    #lastName;
    #document;
    #loginId;
    #role;
    #password;
    
    constructor() {}

    instanceLogin(loginData) {
        this.#firstName = loginData.firstName;
        this.#lastName = loginData.lastName;
        this.#document = loginData.document;
        this.#role = loginData.role;
        this.#loginId = loginData.loginId
    }

    instanceLogout() {
        this.#firstName = undefined;
        this.#lastName = undefined;
        this.#document = undefined;
        this.#role = undefined;
        this.#loginId = undefined;
    }

    get firstName() {
        return this.#firstName;
    }

    get lastName() {
        return this.#lastName;
    }

    get document() {
        return this.#document;
    }

    get loginId() {
        return this.#loginId;
    }

    get role() {
        return this.#role;
    }

    get password() {
        return this.#password;
    }

    set firstName(firstName) {
        this.#firstName = firstName;
    }

    set lastName(lastName) {
        this.#lastName = lastName;
    }

    set loginId(loginId) {
        this.#loginId = loginId;
    }

    set role(role) {
        this.#role = role;
    }

    set password(password) {
        this.#password = password;
    }
}