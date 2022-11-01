import { Button, CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParentContext } from '../App';
import { apiBaseUrl } from '../config';

const Home = () => {
    // States
    const [loadingUser,setLoadingUser] = useState(true);
    const navigate = useNavigate();

    // Context
    const {ovsUser,setOvsUser} = useContext(ParentContext);

    // Useeffects
    
    return (
        <div>
            <footer style={{display:"flex",justifyContent:"flex-end",padding:"1rem",paddingRight:"1.5rem",backgroundColor:"#ebedef",color:"#3c4b64"}}>
                <Typography style={{fontSize:"15px",fontWeight:"500"}}>Copyright © <span style={{color:"#343c97"}}>Rahat Khan Pathan</span> | {new Date().getFullYear()}</Typography>
            </footer>
        </div>
    );
};

export default Home;