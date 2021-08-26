import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <>
            <h1>Dashboard</h1>
            <Link to="/login">Log in</Link>
            <Link to="/registerselect">Register (select user)</Link>
            <Link to="/registermanager">Register Manager</Link>
            <Link to="/registermember">Register Member</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/serviceform">Service Form</Link>
        < />
    );
}

export default Home;