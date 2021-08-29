import React from 'react';
import { Link } from 'react-router-dom';
import InputField 	from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import UserStore 	from '../stores/UserStore';

const API_URL = "http://192.168.2.12:3000";

class RegisterMember extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
            firstName: '',
            lastName: '',
            flatCode: '',
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
            firstName: '',
            lastName: '',
            flatCode: '',
			buttonDisabled: false
		})
	}

    // FIX THIS!!!
    // //API call
	// async doLogin() {
	// 	if (!this.state.email) {
	// 		return;
	// 	}
	// 	if (!this.state.password) {
	// 		return;
	// 	}

	// 	this.setState({
	// 		buttonDisabled: true
	// 	})

	// 	try {
	// 		let res = await fetch(API_URL + '/login', {
	// 			method: 'post',
	// 			headers: {
	// 				'Accept': 'application/json',
	// 				'Content-Type': 'application/json'
	// 			},
    //             credentials: 'include',
	// 			body: JSON.stringify({
	// 				email: this.state.email,
	// 				password: this.state.password
	// 			})
	// 		});
	// 		let result = await res.json();
	// 		if (result && result.success) {
	// 			UserStore.isLoggedIn = true;
	// 			UserStore.email = result.email;
    //             UserStore.fname = result.fname;
    //             UserStore.lname = result.lname;
	// 		} else if (result && result.success === false) {
	// 			this.resetForm();
	// 			alert(result.msg);
	// 		}
	// 	} catch(e) {
	// 		console.log(e);
	// 		this.resetForm();
	// 	}

	// }

    render() {
        return (
            <div>
                <h1 className="text-5xl text-gray-50 font-black text-center py-9">flatbills</h1>
                <div className="w-max h-96 mx-auto bg-gray-50 rounded-lg shadow-2xl">
                    <div>
                        <h3 className="text-2xl text-gray-800 font-semibold text-center pt-7 pb-3">Join flatbills!</h3>
                        <h5 className="text-base text-gray-800 font-semibold text-center pb-4">Join your flat account to track your bill payments.</h5><br />
                    </div>
                    <div className="text-base text-gray-800 font-regular text-center pb-7 flex flex-row mx-14">
                        <div>
                            <InputField 
                                type='text'
                                placeholder='Email'
                                value={this.state.email ? this.state.email : ''}
                                onChange={ (val) => this.setInputValue('email', val) }
                            />
                            <InputField 
                                type='text'
                                placeholder='First Name'
                                value={this.state.firstName ? this.state.firstName : ''}
                                onChange={ (val) => this.setInputValue('firstName', val) }
                            />
                            <InputField 
                                type='text'
                                placeholder='Flat Signup Code'
                                value={this.state.flatCode ? this.state.flatCode : ''}
                                onChange={ (val) => this.setInputValue('flatCode', val) }
                            />
                        </div>
                        <div>
                            <InputField
                                type='password'
                                placeholder='Password'
                                value={this.state.password ? this.state.password : ''}
                                onChange={ (val) => this.setInputValue('password', val) }
                            />
                            <InputField 
                                type='text'
                                placeholder='Last Name'
                                value={this.state.lastName ? this.state.lastName : ''}
                                onChange={ (val) => this.setInputValue('lastName', val) }
                            />
                            <SubmitButton
                                text='Next'
                                disabled={this.state.buttonDisabled}
                                onClick={ () => this.doLogin() }
                            />
                        </div>
                    </div>
                </div>
                <h5 className="text-base text-gray-50 font-regular text-center my-3">Already have an account? Log in <Link to="/login" className="underline">here</Link>.</h5>
            </div>
        );
    }
}

export default RegisterMember;