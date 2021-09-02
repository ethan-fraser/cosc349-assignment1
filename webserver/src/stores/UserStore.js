import { extendObservable } from 'mobx';

/**
 * UserStore
 */
class UserStore {
    constructor() {
        extendObservable(this, {

            //loading: true,
            isLoggedIn: false,
            firstName: '',
            lastName: '',
            email: '',
            flatName: '',
            flatCode: '',
            bills: [],
        })
    }
}

export default new UserStore();