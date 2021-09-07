import React from 'react';
import UserStore from '../stores/UserStore';

class BillCard extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
            billID: props.bill.billID,
            billName: props.bill.name,
            billAmount: props.bill.amount,
            billDate: props.bill.due,
            billStatus: props.bill.status,
            flatMembers: props.bill.members,
		}
        this.doUpdateStatus = props.doUpdateStatus
        this.PayButton = this.PayButton.bind(this)
        this.ManagerList = this.ManagerList.bind(this)
	}

    componentWillReceiveProps(props) {
        this.setState({
            billID: props.bill.billID,
            billName: props.bill.name,
            billAmount: props.bill.amount,
            billDate: props.bill.due,
            billStatus: props.bill.status,
            flatMembers: props.bill.members,
		});
    }

    PayButton(props) {
        let label
        let isButton
        if (props.status === "due" || props.status === "overdue") {
            if (props.name === UserStore.firstName){
                label = "Pay"
                isButton = true
            } else {
                label = "Due"
                isButton = false
            }
        } else if (props.status === "pending") {
            if (UserStore.isManager) {
                label = "Verify"
                isButton = true
            } else {
                label = "Pending"
                isButton = false
            }
        } else {
            label = "Paid"
            isButton = false
        }
        if (isButton) {
            return <button
                className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5 ml-4 mt-3"
                onClick={props.onClick}
                name={props.name}
                billID={this.state.billID}>{label}</button>
        } else {
            return <div className="text-sm font-semibold text-yellow-300 text-right ml-4 mt-3">{label}</div>
        }
    }
    
    ManagerList(props) {
        return (
            <div className="border-t border-gray-800 pt-3">
                {this.state.flatMembers.map((member) => {
                    return (
                        <div className="flex flex-row justify-between mb-3">
                            <div>
                                <h5 className="text-sm text-gray-800 text-left font-semibold">{member.name}</h5>
                                <h5 className="text-sm text-gray-800 text-left">Pay ${member.amount.toFixed(2)}</h5>
                            </div>
                            <this.PayButton
                                status={member.status}
                                name={member.name}
                                onClick={this.doUpdateStatus}
                                />
                        </div>
                    )
                })}
            </div>
        );
    }

	render() {

        // Show MemberPayButton only for members
        let MemberDisplay;
        if (!UserStore.isManager) {
            MemberDisplay = <this.PayButton
                status={this.state.billStatus}
                name={UserStore.firstName}
                onClick={this.doUpdateStatus} />;
        } else {
            MemberDisplay = null;
        }

        // Show ManagerList only for manager
        let ManagerDisplay;
        if (UserStore.isManager) {
            ManagerDisplay = <this.ManagerList />;
        } else {
            ManagerDisplay = null;
        }

		return (
			<div className="w-64 h-auto mx-5 mb-10 px-10 py-5 bg-yellow-100 rounded-lg shadow-2xl">
                <div className="flex flex-row justify-between">
                    <h3 className="text-2xl text-gray-800 font-semibold text-left pt-3 pb-3">{this.state.billName}</h3>
                </div>
                <div className="pb-3">
                    <div className="flex flex-row justify-between">
                        <div><h3 className="text-base text-gray-800 font-semibold text-left pt-3">${this.state.billAmount}</h3></div>
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