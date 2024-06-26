import React, { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, Typography, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import useStyles from './styles';
import logo from '../../images/logo.png';


function Navbar() {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setUser(null);
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        };

        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location]);

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer} >
                <Typography className={classes.heading} component={Link} to='/' variant="h3" align="center">memoriZe</Typography>
                <img className={classes.image} src={logo} alt="memoriZe" height="100px" />
            </div>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant='h6'>
                            {user.result.name}
                        </Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to='/auth' variant='contained' color='primary'>Login</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar