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
            {props.members.map((member) => {
                let btn_label
                if (member.status === "due" || member.status === "overdue") {
                    if (member.name === UserStore.firstName){
                        btn_label = "Pay"
                    }
                    btn_label = "(Awaiting payment)"
                } else if (member.status === "pending") {
                    btn_label = "Verify"
                } else {
                    btn_label = "(Paid)"
                }
                return (
                <div className="flex flex-row justify-between mb-3">
                    <div>
                        <h5 className="text-sm text-gray-800 text-left font-semibold">{member.name}</h5>
                        <h5 className="text-sm text-gray-800 text-left">Pay ${member.amount}</h5>
                    </div>
                    <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5 mt-4">{btn_label}</button>
                </div>
            )})}
        </div>
    );
}

class BillCard extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
            billID: props.bill.billID,
            billName: props.bill.name,
            billAmount: props.bill.amount,
            billDate: props.bill.due,
            flatMembers: props.bill.members,
		}
	}

	render() {

        // Show MemberPayButton only for members
        let MemberDisplay;
        if (!UserStore.isManager) {
            MemberDisplay = <MemberPayButton />;
        } else {
            MemberDisplay = null;
        }

        // Show ManagerList only for manager
        let ManagerDisplay;
        if (UserStore.isManager) {
            ManagerDisplay = <ManagerList members={this.state.flatMembers} />;
        } else {
            ManagerDisplay = null;
        }

		return (
			<div className="w-64 h-auto mx-auto px-10 py-5 bg-yellow-100 rounded-lg shadow-2xl">
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl text-gray-800 font-semibold text-left pt-3 pb-3">{this.state.billName}</h3>  
                    {MemberDisplay}
                </div>
                <div className="pb-3">
                    <h3 className="text-base text-gray-800 font-semibold text-left pt-3">${this.state.billAmount}</h3>
                    <h5 className="text-sm text-gray-800 text-left">Due on {this.state.billDate}</h5>
                </div>
                {ManagerDisplay}
			</div>
		);
	}

}

export default BillCard;