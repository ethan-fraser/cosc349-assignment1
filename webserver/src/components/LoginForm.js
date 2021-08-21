import React 		from 'react';
import InputField 	from './InputField';
import SubmitButton from './SubmitButton';
import UserStore 	from '../stores/UserStore';

const API_URL = process.env.APIURL || "http://192.168.2.12";

class LoginForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			buttonDisabled: false
		}
	}

	setInputValue(property, val) {
		val = val.trim();
		this.setState({
			[property]: val
		})
	}

	resetForm() {
		this.setState({
			email: '',
			password: '',
			buttonDisabled: false
		})
	}

	//API call
	async doLogin() {
		if (!this.state.email) {
			return;
		}
		if (!this.state.password) {
			return;
		}

		this.setState({
			buttonDisabled: true
		})

		try {
			let res = await fetch(API_URL + '/login', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password
				})
			});
			let result = await res.json();
			if (result && result.success) {
				UserStore.isLoggedIn = true;
				UserStore.email = result.email;
                UserStore.fname = result.fname;
                UserStore.lname = result.lname;
			} else if (result && result.success === false) {
				this.resetForm();
				alert(result.msg);
			}
		} catch(e) {
			console.log(e);
			this.resetForm();
		}

	}

	render() {
		return (
			<div className="loginForm">
				Login

				<InputField
					type='text'
					placeholder='Email'
					value={this.state.email ? this.state.email : ''}
					onChange={ (val) => this.setInputValue('email', val) }
				/>

				<InputField
					type='password'
					placeholder='Password'
					value={this.state.password ? this.state.password : ''}
					onChange={ (val) => this.setInputValue('password', val) }
				/>

				<SubmitButton
					text='Login'
					disabled={this.state.buttonDisabled}
					onClick={ () => this.doLogin() }
				/>	

			</div>
		);
	}

}

export default LoginForm;