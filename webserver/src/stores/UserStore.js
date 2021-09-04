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
            isManager: false, // flag for if member is a manager
        })
    }
}

export default new UserStore();