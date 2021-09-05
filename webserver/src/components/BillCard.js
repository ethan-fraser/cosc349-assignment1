import React from 'react';
import UserStore from '../stores/UserStore';

const API_URL = "http://192.168.2.12:3000";

function MemberPayButton(props) {
    return (
        <div>
            <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5 ml-4 mt-3">Pay</button>
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
                        btn_label = <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5">Pay</button>
                    }
                    btn_label = <div className="text-sm font-semibold text-yellow-300 text-right w-auto">Awaiting<br/>Payment</div>
                } else if (member.status === "pending") {
                    btn_label = <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5">Verify</button>
                } else {
                    btn_label = <div className="text-sm font-semibold text-yellow-300 text-right">Paid</div>
                }
                return (
                <div className="flex flex-row justify-between mb-3">
                    <div>
                        <h5 className="text-sm text-gray-800 text-left font-semibold">{member.name}</h5>
                        <h5 className="text-sm text-gray-800 text-left">Pay ${member.amount}</h5>
                    </div>
                    {btn_label}
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
			<div className="w-64 h-auto mx-5 mb-10 px-10 py-5 bg-yellow-100 rounded-lg shadow-2xl">
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl text-gray-800 font-semibold text-left pt-3 pb-3">{this.state.billName}</h3>  
                </div>
                <div className="pb-3">
                    <div className="flex flex-row">
                        <h3 className="text-base text-gray-800 font-semibold text-left pt-3">${this.state.billAmount}</h3>
                        {MemberDisplay}
                    </div>
                    <h5 className="text-sm text-gray-800 text-left">Due on {this.state.billDate}</h5>
                </div>
                {ManagerDisplay}
			</div>
		);
	}

}

export default BillCard;