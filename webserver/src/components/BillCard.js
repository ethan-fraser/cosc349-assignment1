import React from 'react';

function MemberPayButton(props) {
    return (
        <div className="mx-auto">
            <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5 ml-16 mt-5">Pay</button>
        </div>
    );
}

function ManagerList(props) {
    let list = [];
    for (var i = 0; i < props.billcard.state.flatMembers.length; i++) {
        list += <div className="flex flex-row mb-3">
                    <div>
                        <h5 className="text-sm text-gray-800 text-left font-semibold">Magdeline</h5>
                        <h5 className="text-sm text-gray-800 text-left">Pay $400</h5>
                    </div>
                    <button className="text-sm font-semibold text-gray-800 shadow-xl bg-white hover:bg-yellow-50 rounded w-16 h-5 ml-12 mt-4">Pay</button>
                </div>
    }

    return (
        <div className="border-t border-gray-800 pt-3">
            {list}
        </div>
    )
}

class BillCard extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			isManager: false,
            billName: '',
            billAmount: 0,
            billDate: '',
            flatMembers: [0,0,0],
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
            ManagerDisplay = <ManagerList billcard={this} />;
        } else {
            ManagerDisplay = null;
        }

		return (
			<div className="w-64 h-auto mx-auto px-10 py-5 bg-yellow-100 rounded-lg shadow-2xl">
                <div className="flex flex-row">
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