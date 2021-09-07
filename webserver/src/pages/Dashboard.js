import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserStore 	from '../stores/UserStore';
import BillCard     from '../components/BillCard';

const API_URL = "http://192.168.2.12:3000";

function Empty(props) {
    return (
        <div className="mx-auto">
            <h5 className="text-center mb-3">You have not set up any services.</h5>
            <img src='/undraw_not_found_60pq.svg' alt="No input" width="300" height="218.1" className="mx-auto"></img>
        </div>
    );
}

function Bills(props) {
    return (
        <div className="flex justify-start px-44 flex-wrap">
            { props.bills.map( bill => (
                <div>
                    <BillCard bill={bill} doUpdateStatus={props.doUpdateStatus}/>
                </div>
            ))}
        </div>
    )
}

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: true,
            bills: []
        }
        this.doUpdateStatus = this.doUpdateStatus.bind(this);
    }

    // API calls to check if the user is logged in
	async componentDidMount() {
		try {
			let res = await fetch(API_URL + '/isLoggedIn', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
                credentials: 'include'
			});

			let result = await res.json(); // The result from res variable

			// If user is successfully logged in
			if (result && result.success) {
				//UserStore.loading = false;
				UserStore.isLoggedIn = true;
				UserStore.email = result.email;
                UserStore.firstName = result.fname;
                UserStore.lastName = result.lname;
                UserStore.flatName = result.flatName;
                UserStore.flatCode = result.flatID;
                UserStore.isManager = result.is_manager;
                this.setState({isLoggedIn: true})
			} else {
				//UserStore.loading = false;
                this.setState({isLoggedIn: false})
				UserStore.isLoggedIn = false;
			}
		} catch(e) {
			//UserStore.loading = false;
            this.setState({isLoggedIn: false});
			UserStore.isLoggedIn = false;
		}

        try {
            let res = await fetch(API_URL + "/billInfo", {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
					'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    flatCode: UserStore.flatCode,
                    isManager: UserStore.isManager,
                    firstName: UserStore.firstName
                })
            })
            let result = await res.json()
            if (result && result.success){
                this.setState({bills: result.billsInfo})
            } else {
                console.log(result)
            }
        } catch (e) {
            console.error(e)
        }
	}

    async doUpdateStatus(e) {
        let billID = parseInt(e.target.getAttribute('billID'))
        const findBill = (bill) => {
            return bill.billID === billID
        }
        let bill = this.state.bills.find(findBill)
        console.log(billID, bill)
        let status
        let name
        let userEmail
        if (UserStore.isManager) {
            name = e.target.getAttribute('name')
            var member = bill.members.find(member => {
                return member.name === name
            })
            status = member.status
            userEmail = member.email
        } else {
            status = bill.status
            userEmail = UserStore.email
        }
        let newStatus
        if (status === "due" || status === "overdue"){
            if (UserStore.isManager){
                newStatus = "paid"
            } else {
                newStatus = "pending"
            }
        } else if (status === "pending") {
            newStatus = "paid"
        } else {
            return
        }
        try {
			let res = await fetch(API_URL + '/updateBillStatus', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
                credentials: 'include',
				body: JSON.stringify({
					billID: billID,
                    userEmail: userEmail,
                    newStatus: newStatus
				})
			});

			let result = await res.json();

			if (result && result.success) {
                let newBills = this.state.bills.slice()
                let newBill = newBills.find(findBill)
                if (UserStore.isManager) {
                    newBill.members.find(member => { return member.name === name }).status = result.newStatus
                    this.setState({bills: newBills})
                } else {
                    newBill.status = result.newStatus
                    this.setState({ bills: newBills });
                }
			} else {
				console.log(result)
			}

		} catch(e) {
			console.log(e);
			this.resetForm();
		}
    }

    // Instructions for when logout button is pressed
	async doLogout() {
        // API calls to the dbserver
		try {
			let res = await fetch(API_URL + '/logout', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
                credentials: 'include'
			});
			let result = await res.json();
			if (result && result.success) {
                this.setState({isLoggedIn: false});
				UserStore.isLoggedIn = false;
				UserStore.email = '';
                UserStore.firstName = '';
                UserStore.lastName = '';
                UserStore.flatName = '';
                UserStore.flatCode = '';
			}
		} catch(e) {
			console.log(e)
		}
	}

    calculateSummaryAmounts() {
        const findMember = (member) => {
            return member.name === UserStore.firstName
        }
        let result = {
            pending: 0,
            due: 0,
            overdue: 0
        }
        this.state.bills.forEach(bill => {
            let billInfo = bill
            if (UserStore.isManager){
                billInfo = {
                    status: billInfo.members.find(findMember).status,
                    amount: billInfo.members.find(findMember).amount
                }
            }
            if (billInfo.status === "pending") {
                result.pending += billInfo.amount
            } else if (billInfo.status === "due") {
                result.due += billInfo.amount
            } else if (billInfo.status === "overdue") {
                result.overdue += billInfo.amount
            }
        })
        result.total = (result.due + result.overdue).toFixed(2)
        result.pending = result.pending.toFixed(2)
        result.due = result.due.toFixed(2)
        result.overdue = result.overdue.toFixed(2)
        return result
    }

    render() {
        // If user is logged out, go to login page
        if (!this.state.isLoggedIn) {
            return (
                <Redirect to="/login" />
            )
        }

        // Show empty icon if no bills added; Show bill card if bills added
        let display;
        if (this.state.bills.length === 0) {
            display = <Empty />;
        } else {
            display = <Bills bills={this.state.bills} doUpdateStatus={this.doUpdateStatus}/>;
        }

        // Show bill button if flat manager; Hide bill button if flat member
        let billButton;
        if (UserStore.isManager) {
            billButton = <Link to="/serviceform">
                            <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded py-5 px-10 inline-flex items-center">
                                <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/></svg>
                                Add a New Bill
                            </button>
                        </Link>;
        } else {
            billButton = null;
        }

        // Calculate the amounts for the summary section
        let summary = this.calculateSummaryAmounts()

        let pendingLabel
        if (!UserStore.isManager){
            pendingLabel = <h5 className="bg-green-200 rounded py-3 px-7 mx-3">${summary.pending} pending</h5>;
        } else {
            pendingLabel = null;
        }

        // If user is logged in, go to dashboard
        return (
            <div>
                <nav className="bg-blue-400 flex flex-row">
                    <h1 className="text-3xl text-gray-50 font-black text-left py-3 pl-5"><Link to="/dashboard">flatbills</Link></h1>
                    <button
                        className="font-semibold text-blue-400 bg-white hover:bg-gray-50 rounded w-36 py-2 px-2 my-3 mr-5 absolute right-0"
                        onClick={ () => this.doLogout() }
                    >
                        Logout
                    </button>                
                </nav>
                <h2 className="text-sm text-gray-200 text-left px-48 py-3">{UserStore.flatCode}</h2>
                <div className="flex flex-row justify-between px-48">
                    <div>
                        <h3 className="text-2xl text-gray-800 font-semibold text-left py-7">Welcome to {UserStore.flatName},<br/>{UserStore.firstName}!</h3>
                        {billButton}
                    </div>
                    <div className="bg-gray-50 rounded-lg shadow-lg py-5 px-5 border mt-10">
                        <h5 className="text-base text-gray-800 font-semibold text-center pb-4">You have ${summary.total} bills to pay.</h5>
                        <div className="flex flex-row">
                            {pendingLabel}
                            <h5 className="bg-yellow-200 rounded py-3 px-7 mx-3">${summary.due} due</h5>
                            <h5 className="bg-red-200 rounded py-3 px-7 mx-3">${summary.overdue} overdue</h5>
                        </div>
                    </div>
                </div>
                <div className="my-10">
                    {display}
                    {/* <h5 className="text-center mb-3">You have not set up any services.</h5>
                    <img src='/undraw_not_found_60pq.svg' alt="No input" width="300" height="218.1" className="mx-auto"></img> */}
                </div>
            </div>
        );
    }
}

export default Dashboard;