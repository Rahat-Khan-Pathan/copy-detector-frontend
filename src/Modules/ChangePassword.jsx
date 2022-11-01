import { Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ParentContext } from '../App';
import { apiBaseUrl } from '../config';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';


const ChangePassword = () => {
    // STATES
    const [open, setOpen] = useState(false);
    const [openError,setOpenError] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [dialogText,setDialogText] = useState("");
    const [currentPassword,setCurrentPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [repeatNewPassword,setRepeatNewPassword] = useState("");
    const [showPassword1,setShowPassword1] = useState(false);
    const [showPassword2,setShowPassword2] = useState(false);
    const [showPassword3,setShowPassword3] = useState(false);


    const [currentPasswordError,setCurrentPasswordError] = useState(false);
    const [newPasswordError,setNewPasswordError] = useState(false);
    const [repeatNewPasswordError,setRepeatNewPasswordError] = useState(false);

    // Context
    const {ovsUser,setOvsUser} = useContext(ParentContext);

    // HELPER FUNCTIONS
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const validatePassword = pass => {
        if(pass.length >= 6) {
            setNewPasswordError(false);
        } else {
            setErrorMessage("Password length must be greater than 6");
            setNewPasswordError(true);
        }
    }
    const validateRepeatPassword = (pass,repeatPass) => {
        if(repeatPass !== pass) {
            setErrorMessage("Password didn't match");
            setRepeatNewPasswordError(true);
        } else {
            setRepeatNewPasswordError(false);
        }
    }
    const updatePassword = ()=> {
        if(newPasswordError || repeatNewPasswordError || newPassword.length<6) {
            setOpenError(true);
            return;
        }
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/password_change/${ovsUser?._id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                currentpassword: currentPassword,
                newpassword: newPassword,
            })
          })
            .then((res) => {
                setDialogText("Password Changed Successfully");
                setNewPassword("");
                setCurrentPassword("");
                setRepeatNewPassword("");
                handleOpen();
                setOpenError(false);
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }

    // USEEFFECTS 
    useEffect(()=> {
        validatePassword("");
    },[])
    return (
        <div style={{marginTop:"10rem",marginBottom:"5rem"}}>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogContent>
                    <DialogContentText>
                        {dialogText ? 
                            <figure>
                                <pre>
                                <code contenteditable spellcheck="false">
                                    {dialogText}
                                </code>
                                </pre>
                          </figure>
                        : "Empty"}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        OK
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={4} style={{border: "2px solid #343c97",borderRadius:"15px"}} >
                    <Grid container spacing={2} style={{padding:"3rem"}}>
                        <Grid item xs={12} style={{marginBottom:"1rem"}}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">Current Password</InputLabel>
                                <Input
                                    fullWidth
                                    id="standard-adornment-password"
                                    type={showPassword1 ? 'text' : 'password'}
                                    // size="small"
                                    
                                    inputProps={{ style: { color: '#6c63ff',fontSize:"1rem"}}}
                                    value={currentPassword}
                                    onChange={e=> {
                                        setCurrentPassword(e.target.value);
                                        setOpenError(false);
                                    }}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=> {
                                            setShowPassword1(!showPassword1);
                                        }}
                                        edge="end"
                                        >
                                        {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="Current Password"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{marginBottom:"1rem"}}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
                                <Input
                                    fullWidth
                                    id="standard-adornment-password"
                                    type={showPassword2 ? 'text' : 'password'}
                                    // size="small"
                                    
                                    inputProps={{ style: { color: '#6c63ff',fontSize:"1rem"}}}
                                    value={newPassword}
                                    
                                    onChange={e=> {
                                        setNewPassword(e.target.value);
                                        validatePassword(e.target.value);
                                        validateRepeatPassword(e.target.value,repeatNewPassword);
                                        setOpenError(false);
                                    }}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=> {
                                            setShowPassword2(!showPassword2);
                                        }}
                                        edge="end"
                                        >
                                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="New Password"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{marginBottom:"1rem"}}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">Repeat New Password</InputLabel>
                                <Input
                                    fullWidth
                                    id="standard-adornment-password"
                                    type={showPassword3 ? 'text' : 'password'}
                                    // size="small"
                                    inputProps={{ style: { color: '#6c63ff',fontSize:"1rem"}}}
                                    value={repeatNewPassword}
                                    onChange={e=> {
                                        setRepeatNewPassword(e.target.value);
                                        validateRepeatPassword(newPassword,e.target.value);
                                        setOpenError(false);
                                    }}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=> {
                                            setShowPassword3(!showPassword3);
                                        }}
                                        edge="end"
                                        >
                                        {showPassword3 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="Repeat New Password"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ width: '100%' }}>
                                <Collapse in={openError}>
                                    <Alert
                                    severity="error"
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpenError(false);
                                        }}
                                        >
                                        <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                    >
                                     {errorMessage}
                                    </Alert>
                                </Collapse>
                                </Box>
                        </Grid>
                        <Grid item xs={12} textAlign="center" style={{marginTop:"1rem"}}>
                            <Button
                                size='small'
                                onClick={() => {
                                    updatePassword();
                                }}
                                variant="contained"
                                style={{backgroundColor:"#653df5",color:"white"}}
                                >
                                UPDATE PASSWORD
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default ChangePassword;