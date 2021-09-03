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

function Bills(pros) {
    return (
        <div className="flex justify-start gap-16 px-48">
            <div><BillCard /></div>
            <div><BillCard /></div>
            <div><BillCard /></div>
        </div>
    )
}

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: true
        }
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
                this.setState({isLoggedIn: true})
				UserStore.isLoggedIn = true;
				UserStore.email = result.email;
                UserStore.firstName = result.fname;
                UserStore.lastName = result.lname;
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
                UserStore.billName = '';
                UserStore.billDate = '';
                UserStore.billAmount = 0;
                UserStore.filledService = false; // Whether or not the service form has been filled
			}
		} catch(e) {
			console.log(e)
		}
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
        if (UserStore.bills.length === 0) {
            display = <Empty />;
        } else {
            display = <Bills />;
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

        // If user is logged in, go to dashboard
        return (
            <div className="bg-gray-50 min-h-screen">
                <nav className="bg-blue-400 flex flex-row">
                    <h1 className="text-3xl text-gray-50 font-black text-left py-3 pl-5"><Link to="/dashboard">flatbills</Link></h1>
                    <button
                        className="font-semibold text-blue-400 bg-white hover:bg-gray-50 rounded w-36 py-2 px-2 my-3 mr-5 absolute right-0"
                        onClick={ () => this.doLogout() }
                    >
                        Logout
                    </button>                
                </nav>
                <div className="flex flex-row justify-between px-48">
                    <div>
                        <h3 className="text-2xl text-gray-800 font-semibold text-left py-7">Welcome to {UserStore.flatName},<br/>{UserStore.firstName}!</h3>
                        {billButton}
                    </div>
                    <div className="bg-gray-50 rounded-lg shadow-lg py-5 px-5 border mt-10">
                        <h5 className="text-base text-gray-800 font-semibold text-center pb-4">You have $0.00 bills to pay.</h5>
                        <div className="flex flex-row">
                            <h5 className="bg-green-200 rounded py-3 px-7 mx-3">$0.00 pending</h5>
                            <h5 className="bg-yellow-200 rounded py-3 px-7 mx-3">$0.00 due</h5>
                            <h5 className="bg-red-200 rounded py-3 px-7 mx-3">$0.00 overdue</h5>
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