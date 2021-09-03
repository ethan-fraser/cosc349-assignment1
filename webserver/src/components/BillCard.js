import React from 'react';
import UserStore from '../stores/UserStore';

const API_URL = "http://192.168.2.12:3000";

function MemberPayButton(props) {
    return (
        <div>
            <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5 mt-5">Pay</button>
        </div>
    );
}

function ManagerList(props) {
    return (
        <div className="border-t border-gray-800 pt-3">
            {props.members.map((member) => (
                <div className="flex flex-row justify-between mb-3">
                    <div>
                        <h5 className="text-sm text-gray-800 text-left font-semibold">{member.name}</h5>
                        <h5 className="text-sm text-gray-800 text-left">Pay ${member.amount}</h5>
                    </div>
                    <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5 mt-4">{member.btn_label}</button>
                </div>
            ))}
        </div>
    );
}

class BillCard extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			isManager: false,
            billName: '',
            billAmount: 0,
            billDate: '',
            flatMembers: [{
                name: "Magdeline",
                amount: "200",
                btn_label: "Pay"
            },
            {
                name: "Ethan",
                amount: "200",
                btn_label: "Pay"
            }],
		}

	}

    // asnyc componentDidMount() {
    //     // access the api, asking for all the members in the flat with flatCode
    //     // also get the bill associated with this card (bill.amount / flatMembers.length)
    //     // for each of those members, add an object to this.state.flatMembers with their info
    // }

    // API calls to get info for flatMembers
	async componentDidMount() {
		try {
			let res = await fetch(API_URL + '/getBillInfo', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
                credentials: 'include',
                body: JSON.stringify({
					flatCode: UserStore.flatCode,
					email: UserStore.email
				})
			});

			let result = await res.json(); // The result from res variable

			// If user is successfully logged in
			if (result && result.success) {
                UserStore.flatCode = result.flatCode;
                UserStore.email = result.email;
			} else {
				// //UserStore.loading = false;
                // this.setState({isLoggedIn: false})
				// UserStore.isLoggedIn = false;
			}
		} catch(e) {
			// //UserStore.loading = false;
            // this.setState({isLoggedIn: false});
			// UserStore.isLoggedIn = false;
		}
	}

	render() {

        // Show MemberPayButton only for members
        let MemberDisplay;
        if (!this.state.isManager) {
            MemberDisplay = <MemberPayButton />;
        } else {
            MemberDisplay = null;
        }

        // Show ManagerList only for manager
        let ManagerDisplay;
        if (!this.state.isManager) {
            ManagerDisplay = <ManagerList members={this.state.flatMembers} />;
        } else {
            ManagerDisplay = null;
        }

		return (
			<div className="w-64 h-auto mx-auto px-10 py-5 bg-yellow-100 rounded-lg shadow-2xl">
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl text-gray-800 font-semibold text-left pt-3 pb-3">Rent</h3>  
                    {MemberDisplay}
                </div>
                <div className="pb-3">
                    <h3 className="text-base text-gray-800 font-semibold text-left pt-3">$400</h3>
                    <h5 className="text-sm text-gray-800 text-left">Due on 31 August 2021</h5>
                </div>
                {ManagerDisplay}
			</div>
		);
	}

}

export default BillCard;