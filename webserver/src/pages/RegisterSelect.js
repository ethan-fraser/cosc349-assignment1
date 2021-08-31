import React from 'react';
import { Link } from 'react-router-dom';

function UserSelect() {
    return (
        <div className="grid place-items-center">
            <h1 className="text-5xl text-gray-50 font-black text-center py-9">flatbills</h1>
            <div className="w-96 h-96 mx-auto bg-gray-50 rounded-lg shadow-2xl">
                <div>
                    <h3 className="text-2xl text-gray-800 font-semibold text-center pt-7 pb-3">Join flatbills!</h3>
                    <h5 className="text-base text-gray-800 font-semibold text-center pb-4">Please choose your role.</h5><br />
                </div>
                <div className="my-3 text-center">
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-64 py-2 px-2 my-3"><Link to="/registermanager">Flat Manager</Link></button><br/>
                    <h5 className="text-sm text-gray-800 font-regular text-center">You manage the bill payments for your flat.</h5><br/>
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-64 py-2 px-2 my-3"><Link to="/registermember">Flat Member</Link></button><br/>
                    <h5 className="text-sm text-gray-800 font-regular text-center pb-4">You are a regular member living in the flat.</h5><br/>
                </div>
            </div>
            <h5 className="text-base text-gray-50 font-regular text-center my-3">Already have an account? Log in <Link to="/login" className="underline">here</Link>.</h5>
        </div>
    );
}

export default UserSelect;