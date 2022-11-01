import { LoadingButton } from '@mui/lab';
import { Alert, CircularProgress, Collapse, Grid, IconButton, Slide, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link,useNavigate  } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import signUpPoster from '../Resources/sign-up-poster.png'
import axios from 'axios';
import { apiBaseUrl } from '../config';
import { ParentContext } from '../App';
import { Box } from '@mui/system';

// Initial signUp data
const initialSignUpData = {
    username: "example.username",
    email: "example@email.com",
    password: "justtocheckthepassword",
    repeatPassword: "justtocheckthepassword",
}
const SignUp = () => {
    // States
    const [signUpData,setSignUpData] = useState(initialSignUpData);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFailure, setOpenFailure] = useState(false);
    const [message, setMessage] = useState("");
    const [userNameError,setUserNameError] = useState(false);
    const [emailError,setEmailError] = useState(false);
    const [passwordError,setPasswordError] = useState(false);
    const [repeatPasswordError,setRepeatPasswordError] = useState(false);
    const [emailValidationError,setEmailValidationError] = useState(false);
    const [usernameValidationError,setUsernameValidationError] = useState(false);
    const [loading,setLoading] = useState(false);
    const [loadingUser,setLoadingUser] = useState(true);
    const navigate = useNavigate ()

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
    const validateUserName = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/validate_username/${signUpData.username}`,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
                if(res.data.results) {
                    setUserNameError(res.data.results.has);
                    if(res.data.results.has) {
                        return true;
                    } else {
                        return false;
                    }
                }
            })
            .catch((err) => {
                err.response.data ? showFailure(err.response.data) : showFailure("Something Went Wrong. Please Try Again Later!");
                return true;
            });
    }
    const validateEmail = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/validate_email/${signUpData.email}`,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
                if(res.data.results) {
                    setEmailError(res.data.results.has);
                    if(res.data.results.has) {
                        return true;
                    } else {
                        return false;
                    }
                }
            })
            .catch((err) => {
                err.response.data ? showFailure(err.response.data) : showFailure("Something Went Wrong. Please Try Again Later!");
                return true;
            });
    }
    const validatePassword = pass => {
        if(pass.length > 0 && pass.length < 6) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    }
    const validateRepeatPassword = (pass,repeatPass) => {
        if(repeatPass !== pass) {
            setRepeatPasswordError(true);
        } else {
            setRepeatPasswordError(false);
        }
    }
    const signUp = ()=> {
        if(validateUserName()) {
            return;
        }
        if(validateEmail()) {
            return;
        }
        setLoading(true);
        const data = {username:signUpData.username,email:signUpData.email,password:signUpData.password,admin:false};
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/new`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
          })
            .then((res) => {
                setLoading(false);
                showSuccess("Sign Up Successfull");
                setOvsUser({...ovsUser,email:signUpData.email});
                setSignUpData(initialSignUpData);
                if(res.data.results) {
                    setOvsUser(res.data.results);
                    navigate("/register");
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
                        <img src={signUpPoster} alt="" style={{mixBlendMode:"multiply",width:"100%"}} />
                    </Slide>
                </Grid>
                <Grid item xs={6} style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
                    <Grid container style={{marginBottom:"2rem"}}>
                        <Grid item xs={12}>
                            <Slide direction="down" in mountOnEnter unmountOnExit>
                                <div>
                                    <Typography variant='h4' style={{fontWeight:"bold",textAlign:"center",fontSize:"1.7rem",marginBottom:"0.2rem"}}>Welcome To <span style={{color: '#6c63ff',fontSize:"2rem"}}>Programming Hero Copy Detector.</span></Typography>
                                    <Typography variant='h6' style={{fontWeight:"bold",textAlign:"center",fontSize:"1.5rem"}}>Sign Up Today!</Typography>
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
                                    label="Username"
                                    variant="standard"
                                    value={signUpData.username}
                                    error={userNameError || usernameValidationError}
                                    helperText={userNameError ? "Username already exists" : usernameValidationError? "Invalid Username" : ""}
                                    onChange={e=> {
                                        setSignUpData({...signUpData,username:e.target.value});
                                        setUsernameValidationError(!Boolean(e.target.value));
                                        setUserNameError(false);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    id="standard-required"
                                    label="Email"
                                    value={signUpData.email}
                                    variant="standard"
                                    error={emailError || emailValidationError}
                                    helperText={emailError ? "This email is already registered" : emailValidationError? "Invalid email" : ""}
                                    onChange={e=> {
                                        setSignUpData({...signUpData,email:e.target.value});
                                        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        setEmailValidationError(!re.test(e.target.value));
                                        setEmailError(false);
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
                                    error={passwordError}
                                    helperText={passwordError ? "Password length must be minimum 6" : ""}
                                    onChange={e=> {
                                        setSignUpData({...signUpData,password:e.target.value});
                                        validatePassword(e.target.value);
                                        validateRepeatPassword(e.target.value,signUpData.repeatPassword);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    inputProps={{ style: { color: '#6c63ff',fontSize:"1.3rem"}}}
                                    type="password"
                                    id="standard-required"
                                    label="Repeat Password"
                                    defaultValue="justtocheckthepassword"
                                    variant="standard"
                                    error={repeatPasswordError}
                                    helperText={repeatPasswordError ? "Password didn't match" : ""}
                                    onChange={e=> {
                                        setSignUpData({...signUpData,repeatPassword:e.target.value});
                                        validateRepeatPassword(signUpData.password,e.target.value);
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
                            <Grid item xs={5}>
                                <LoadingButton
                                    fullWidth
                                    loading={loading}
                                    loadingPosition="start"
                                    variant="outlined"
                                    style={!(userNameError || emailError || passwordError || repeatPasswordError || usernameValidationError || emailValidationError) ? {backgroundColor:"#6c63ff",color:"white",border:"none",borderRadius:"3rem"} : {border:"none",borderRadius:"3rem",backgroundColor:"#e0e0e0",color:"#adadad"}}
                                    disabled={userNameError || emailError || passwordError || repeatPasswordError || usernameValidationError || emailValidationError}
                                    onClick={()=>{
                                        clearSuccessFailure();
                                        signUp();
                                    }}
                                >
                                    Sign Up
                                </LoadingButton>
                            </Grid>
                            <Grid item xs={7}>
                                <Link to="/login" style={{textDecoration:"none",color:"#396EB0",fontWeight:"400"}}>Already a member? Log In</Link>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default SignUp;