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
            billName: '',
            billDate: '',
            billAmount: 0,
            filledService: false, // Whether or not the service form has been filled
        })
    }
}

export default new UserStore();