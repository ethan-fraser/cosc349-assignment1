import React 		from 'react';
import { observer } from 'mobx-react';
import UserStore 	from './stores/UserStore';
import LoginForm 	from './components/LoginForm';
import SubmitButton from './components/SubmitButton';
import './App.css';

class App extends React.Component {

	// API calls to check if the user is logged in
	async componentDidMount() {
		try {
			let res = await fetch('/isLoggedIn', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});
			let result = await res.json();
			if (result && result.success) {
				UserStore.loading = false;
				UserStore.isLoggedIn = true;
				UserStore.email = result.email;
                UserStore.fname = result.fname;
                UserStore.lname = result.lname;
			} else {
				UserStore.loading = false;
				UserStore.isLoggedIn = false;
			}
		} catch(e) {
			UserStore.loading = false;
			UserStore.isLoggedIn = false;
		}
	}

	//Logout API endpoint
	async doLogout() {
		try {
			let res = await fetch('/logout', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});
			let result = await res.json();
			if (result && result.success) {
				UserStore.isLoggedIn = false;
				UserStore.email = '';
                UserStore.fname = '';
                UserStore.lname = '';
			}
		} catch(e) {
			console.log(e)
		}
	}

	render() {
		// If page is loading, show loading message
		if (UserStore.loading) {
			return (
				<div className="app">
					<div className="container">
						Loading, please wait...
					</div>	
				</div>
			);
		}
		//If logged in, greet user and display logout button
		else if (UserStore.isLoggedIn) {
            return (
                <div className="app">
                    <div className="container">
                        Welcome {UserStore.fname}

                        <SubmitButton
                            text={'Logout'}
                            disabled={false}
                            onClick={ () => this.doLogout() }
                        />
                    </div>	
                </div>
            );
		}
		//If not logged in, display the login form
		return (
			<div className="app">	
				<div className='container'>
					<LoginForm />
				</div>
			</div>
		);

	}

}

export default observer(App);