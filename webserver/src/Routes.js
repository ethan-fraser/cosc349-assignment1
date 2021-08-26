import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterSelect from './pages/RegisterSelect';
import RegisterManager from './pages/RegisterManager';
import RegisterMember from './pages/RegisterMember';
import Dashboard from './pages/Dashboard';
import ServiceForm from './pages/ServiceForm';

function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
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
            <Route path="/dashboard">
                <Dashboard />
            </Route>
            <Route path="/serviceform">
                <ServiceForm />
            </Route>
        </Switch>
    );
}

export default Routes;