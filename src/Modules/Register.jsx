import { Alert, Button, Chip, Collapse, Grid, IconButton, Paper, Slide, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { MdFileUpload } from "react-icons/md";
import { apiBaseUrl } from '../config';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { ParentContext } from '../App';
import { useNavigate } from 'react-router-dom';
import RegisterPoster from '../Resources/register-poster.png'


const Register = () => {

    // Context 
    const {ovsUser,setOvsUser} = useContext(ParentContext);
    const navigate = useNavigate();

   useEffect(()=> {
    if(ovsUser && ovsUser.registered)
    {
        navigate("/home");
    }
   },[])
    
    return (
        <>
            <Grid container style={{minHeight:"100vh"}} alignItems="center" flexDirection="row-reverse">
                <Grid item xs={6} style={{backgroundColor:"#EEF2FF",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Slide direction="left" in mountOnEnter unmountOnExit>
                        <img src={RegisterPoster} alt="" style={{mixBlendMode:"multiply",width:"100%"}} />
                    </Slide>
                </Grid>
                <Grid item xs={6} style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
                    <Slide direction="down" in mountOnEnter unmountOnExit>
                        <div>
                            <Typography variant='h4' style={{fontWeight:"bold",textAlign:"center",fontSize:"1.7rem",marginBottom:"0.2rem"}}>Welcome <span style={{color: '#6c63ff',fontSize:"2rem"}}>Hero</span></Typography>
                        </div>
                    </Slide>
                    <Typography style={{fontWeight:"normal", fontSize:"1.2rem",marginTop:"1rem"}}>Your account need to be confirmed. Please contact <a href="support@phitron.io">support@phitron.io</a></Typography>
                </Grid>
            </Grid>
        </>
    );
};

export default Register;