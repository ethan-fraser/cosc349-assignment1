import React from 'react';
import { Switch, Route } from 'react-router-dom';
//import Home from './pages/Home';
import Login from './pages/Login';
import RegisterSelect from './pages/RegisterSelect';
import RegisterManager from './pages/RegisterManager';
import RegisterMember from './pages/RegisterMember';
import Dashboard from './pages/Dashboard';
import ServiceForm from './pages/ServiceForm';
import { observer } from 'mobx-react';
import UserStore 	from './stores/UserStore';

const API_URL = "http://192.168.2.12:3000";

class Routes extends React.Component {

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
                UserStore.fname = result.fname;
                UserStore.lname = result.lname;
			} else {
				//UserStore.loading = false;
				UserStore.isLoggedIn = false;
			}
		} catch(e) {
			//UserStore.loading = false;
			UserStore.isLoggedIn = false;
		}
	}

    render() {
		// // If page is loading, show loading message
		// if (UserStore.loading) {
		// 	return (
		// 		<div>
		// 			<div>
		// 				Loading, please wait...
		// 			</div>	
		// 		</div>
		// 	);
		// }
        
		//If logged in, show dashboard
		if (UserStore.isLoggedIn) {
            return (
                <div>
                    <Switch>
                        <Route path="/dashboard">
                            <Dashboard />
                        </Route>
                    </Switch>
                </div>
            );
		}

		//If not logged in
		return (
            <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/registerselect">
                    <RegisterSelect />
                </Route>
                <Route path="/registermanager">
                    <RegisterManager />
                </Route>
                <Route path="/registermember">
                    <RegisterMember />
                </Route>
                <Route path="/serviceform">
                    <ServiceForm />
                </Route>
                {/* <Route path="/dashboard">
                    <Dashboard />
                </Route> */}
            </Switch>
        );
	}
}

export default observer(Routes);

// function Routes() {
//     return (
//         <Switch>
//             <Route exact path="/">
//                 <Login />
//             </Route>
//             <Route path="/login">
//                 <Login />
//             </Route>
//             <Route path="/registerselect">
//                 <RegisterSelect />
//             </Route>
//             <Route path="/registermanager">
//                 <RegisterManager />
//             </Route>
//             <Route path="/registermember">
//                 <RegisterMember />
//             </Route>
//             <Route path="/dashboard">
//                 <Dashboard />
//             </Route>
//             <Route path="/serviceform">
//                 <ServiceForm />
//             </Route>
//         </Switch>
//     );
// }

// export default Routes;