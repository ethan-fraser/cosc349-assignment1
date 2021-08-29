import React from 'react';
import { Link } from 'react-router-dom';
import InputField 	from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import UserStore 	from '../stores/UserStore';

const API_URL = "http://192.168.2.12:3000";

class ServiceForm extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			name: '',
			date: '',
            frequency: '',
            day: '',
            type: '',
            amount: '',
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
            flatName: '',
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
            <div className="bg-gray-50 min-h-screen">
                <nav className="bg-blue-400 flex flex-row">
                    <h1 className="text-3xl text-gray-50 font-black text-left py-3 pl-5"><Link to="/dashboard">flatbills</Link></h1>
                    <button className="font-semibold text-blue-400 bg-white hover:bg-gray-50 rounded w-36 py-2 px-2 my-3 mr-5 absolute right-0"><Link to="/login">Logout</Link></button>                
                </nav>
                
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
                            placeholder='Flat Name'
                            value={this.state.flatName ? this.state.flatName : ''}
                            onChange={ (val) => this.setInputValue('flatName', val) }
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
        );
    }
}

export default ServiceForm;