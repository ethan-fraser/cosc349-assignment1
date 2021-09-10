import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
//import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// import RegisterSelect from './pages/RegisterSelect';
// import RegisterManager from './pages/RegisterManager';
// import RegisterMember from './pages/RegisterMember';
import Dashboard from './pages/Dashboard';
import BillForm from './pages/BillForm';
import { observer } from 'mobx-react';
// import UserStore 	from './stores/UserStore';

const API_URL = "http://192.168.2.12:3000";

class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        };
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
				this.setState({isLoggedIn: true});
			}
		} catch(e) {
			console.log(e);
		}
	}

    render() {
		// If page is loading, show loading message
		if (this.state.loading) {
			return (
				<div>
					<div>
						Loading, please wait...
					</div>	
				</div>
			);
		}

		//If logged in, show dashboard
        let firstPage;
		if (this.state.isLoggedIn) {
            firstPage = "/dashboard"
		} else {
            firstPage = "/login"
        }

		//If not logged in
		return (
            <Switch>
                <Route exact path="/">
                    <Redirect to={firstPage} />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/billform">
                    <BillForm />
                </Route>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
            </Switch>
        );
	}
}

export default observer(Routes);