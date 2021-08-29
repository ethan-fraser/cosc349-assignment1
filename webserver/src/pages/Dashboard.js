import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <nav className="bg-blue-400 flex flex-row">
                <h1 className="text-3xl text-gray-50 font-black text-left py-3 pl-5">flatbills</h1>
                <button className="font-semibold text-blue-400 bg-white hover:bg-gray-50 rounded w-36 py-2 px-2 my-3 mr-5 absolute right-0"><Link to="/login">Logout</Link></button>                
            </nav>
            <div className="flex flex-row">
                <div>
                    <h3 className="text-2xl text-gray-800 font-semibold text-left py-7 ml-60">Welcome to 660 Castle Street,<br/>Magdeline!</h3>
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded py-5 px-10 ml-60 inline-flex items-center">
                        <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/></svg>
                        <Link to="/serviceform">Setup a service</Link>
                    </button>
                </div>
                <div className="bg-gray-50 rounded-lg shadow-lg ml-20 mt-10 py-5 px-5 border">
                    <h5 className="text-base text-gray-800 font-semibold text-center pb-4">You have $0.00 bills to pay.</h5>
                    <div className="flex flex-row">
                        <h5 className="bg-green-200 rounded py-3 px-7 mx-3">$0.00 paid</h5>
                        <h5 className="bg-red-200 rounded py-3 px-7 mx-3">$0.00 left</h5>
                    </div>
                </div>
            </div>
            <div className="my-10">
                <h5 className="text-center mb-3">You have not set up any services.</h5>
                <img src='/undraw_not_found_60pq.svg' alt="No input" width="300" height="218.1" className="mx-auto"></img>
            </div>
        </div>
    );
}

export default Dashboard;