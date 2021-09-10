import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {

	render() {
		return (
			<nav className="bg-blue-400 flex flex-row">
                <h1 className="text-3xl text-gray-50 font-black text-left py-3 px-3 inline-flex">
                    <img src='/flatbills_logo.png' alt="flatbills logo" width="35" height="35" className="mr-2"></img>
                    <Link to="/dashboard">flatbills</Link>
                </h1>
                <button
                    className="font-semibold text-blue-400 bg-white hover:bg-gray-50 rounded w-36 py-2 px-2 my-3 mr-5 absolute right-0"
                    onClick={ () => this.props.onClick() }
                >
                    Logout
                </button>                
            </nav>
		);
	}

}

export default Navbar;