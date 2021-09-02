import React from 'react';

class BillCard extends React.Component {

	render() {
		return (
			<div className="w-64 h-auto mx-auto px-10 py-5 bg-yellow-200 rounded-lg shadow-2xl">
                <h3 className="text-2xl text-gray-800 font-semibold text-left pt-3 pb-3">Rent</h3>
                <div className="border-b border-gray-800 pb-3">
                    <h3 className="text-base text-gray-800 font-semibold text-left pt-3">$400</h3>
                    <h5 className="text-sm text-gray-800 text-left">Due on 31 August 2021</h5>
                </div>
                <div className="flex flex-row pt-3">
                    <div>
                        <h5 className="text-sm text-gray-800 text-left font-semibold">Magdeline</h5>
                        <h5 className="text-sm text-gray-800 text-left">Pay $400</h5>
                    </div>
                    <button className="text-sm font-semibold text-gray-800 bg-yellow-50 hover:bg-yellow-100 rounded w-14 h-5 ml-14 mt-4">Pay</button>
                </div>
			</div>
		);
	}

}

export default BillCard;