export default class User {
    #firstName;
    #lastName;
    #document;
    #loginId;
    #userId;
    #role;
    #password;
    
    constructor() {}

    instanceLogin(loginData) {
        this.#firstName = loginData.firstName;
        this.#lastName = loginData.lastName;
        this.#document = loginData.document;
        this.#role = loginData.role;
        this.#userId = loginData.userId;
    }

    instanceLogout() {
        this.#firstName = undefined;
        this.#lastName = undefined;
        this.#document = undefined;
        this.#role = undefined;
        this.#userId = undefined;
    }

    
}