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
}