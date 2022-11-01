import { LoadingButton } from '@mui/lab';
import { Alert, Collapse, Grid, IconButton, Slide, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../config';
import loginPoster from '../Resources/login-poster.png'
import CloseIcon from '@mui/icons-material/Close';
import { ParentContext } from '../App';

// Initial login data
const initialLoginData = {
    usernameoremail: "",
    password: "",
}
const Login = () => {
    // States
    const [loginData,setLoginData] = useState(initialLoginData);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFailure, setOpenFailure] = useState(false);
    const [message, setMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    // Context
    const {ovsUser,setOvsUser} = useContext(ParentContext);

    // Helper functions
    const showFailure = (msg)=> {
        setMessage(msg);
        setOpenFailure(true);
        setOpenSuccess(false);
    }
    const showSuccess = (msg)=> {
        setMessage(msg);
        setOpenFailure(false);
        setOpenSuccess(true);
    }
    const clearSuccessFailure = ()=> {
        setOpenFailure(false);
        setOpenSuccess(false);
    }
    const handleLogin= async ()=> {
        if(!loginData.usernameoremail) {
            showFailure("Invalid Username/Email");
            return;
        }
        setLoading(true);
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/login`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(loginData),
          })
            .then((res) => {
                setLoading(false);
                showSuccess("Login Successfull");
                setLoginData(initialLoginData);
                if(res.data.results) {
                    setOvsUser(res.data.results);
                    if(res.data.results.registered) {
                        navigate("/home");
                    } else {
                        navigate("/register");
                    }
                    localStorage.setItem("ovs_user",res.data.results?._id);
                }
            })
            .catch((err) => {
                setLoading(false);
                err?.response?.data ? showFailure(err.response.data) : showFailure("Something Went Wrong. Please Try Again Later!");
        });
    }

    // Useeffects
    
    return (
        <div> 
            <Grid container style={{minHeight:"100vh"}} alignItems="center">
                <Grid item xs={6} style={{backgroundColor:"#EEF2FF",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Slide direction="right" in mountOnEnter unmountOnExit>
                        <img src={loginPoster} alt="" style={{mixBlendMode:"multiply",width:"100%"}} />
                    </Slide>
                </Grid>
                <Grid item xs={6} style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
                    <Grid container style={{marginBottom:"2rem"}}>
                        <Grid item xs={12}>
                            <Slide direction="down" in mountOnEnter unmountOnExit>
                                <div>
                                    <Typography variant='h4' style={{fontWeight:"bold",textAlign:"center",fontSize:"1.7rem",marginBottom:"0.2rem"}}>Welcome <span style={{color: '#6c63ff',fontSize:"2rem"}}>Hero</span></Typography>
                                </div>
                            </Slide>
                        </Grid>
                    </Grid>
                    <div style={{width:"60%"}}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="standard-required"
                                    label="Username/Email"
                                    variant="standard"
                                    value={loginData.usernameoremail}
                                    onChange={e=> {
                                        setLoginData({...loginData,usernameoremail:e.target.value});
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    inputProps={{ style: { color: '#6c63ff',fontSize:"1.3rem"}}}
                                    type="password"
                                    id="standard-required"
                                    label="Password"
                                    defaultValue="justtocheckthepassword"
                                    variant="standard"
                                    value={loginData.password}
                                    onChange={e=> {
                                        setLoginData({...loginData,password:e.target.value});
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ margin: 0 }}>
                                    <Collapse in={openSuccess}>
                                    <Alert
                                        action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                            setOpenSuccess(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    >
                                        {message}
                                    </Alert>
                                    </Collapse>
                                    <Collapse in={openFailure}>
                                    <Alert
                                        severity="error"
                                        action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                            setOpenFailure(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                        }
                                    >
                                        {message}
                                    </Alert>
                                    </Collapse>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <LoadingButton
                                    fullWidth
                                    loadingPosition="start"
                                    variant="outlined"
                                    style={{backgroundColor:"#6c63ff",color:"white",border:"none",borderRadius:"3rem"}}
                                    loading={loading}
                                    onClick={()=> {
                                        clearSuccessFailure();
                                        handleLogin();
                                    }}
                                >
                                    Log In
                                </LoadingButton>
                            </Grid>
                            <Grid item xs={8}>
                                <Link to="/signUp" style={{textDecoration:"none",color:"#396EB0",fontWeight:"400"}}>Don't have an account? Sign Up</Link>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;