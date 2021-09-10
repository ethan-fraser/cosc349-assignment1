import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <>
            <h1 className="text-5xl text-gray-50 font-black text-center py-9">flatbills</h1>
            <div className="w-96 h-96 mx-auto bg-gray-50 rounded-lg shadow-2xl">
                <div className="py-14 text-center">
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-36 py-2 px-2 my-3"><Link to="/login">Log in</Link></button><br/>
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-36 py-2 px-2 my-3"><Link to="/registerselect">Register</Link></button><br/>
                    {/* <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-36 py-2 px-2 my-3"><Link to="/registermanager">Register Manager</Link></button><br/>
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-36 py-2 px-2 my-3"><Link to="/registermember">Register Member</Link></button><br/> */}
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-36 py-2 px-2 my-3"><Link to="/dashboard">Dashboard</Link></button><br/>
                    <button className="font-semibold text-white bg-blue-400 hover:bg-blue-300 rounded w-36 py-2 px-2 my-3"><Link to="/serviceform">Service Form</Link></button><br/>
                </div>
            </div>
        </>
    );
}

export default Home;