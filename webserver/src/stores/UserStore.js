import { extendObservable } from 'mobx';

class Bill {
    name = '';
    date = '';
    amount = 0;
}

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
            billName: '',
            billDate: '',
            billAmount: 0,
        })
    }
}

export default new UserStore();