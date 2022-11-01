import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ParentContext } from '../App';
import { apiBaseUrl } from '../config';

const AcceptUser = () => {
    // STATES 
    const [open, setOpen] = useState(false);
    const [dialogText,setDialogText] = useState("");
    const [unregisteredUsers,setUnregisteredUsers] = useState([]);
    const [rejectID,setRejectID] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openConfirm, setOpenConfirm] = useState(false);


    // Context
    const {ovsUser,setOvsUser} = useContext(ParentContext);

    // HELPER FUNCTIONS
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };
    
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    // DATA FUNCTIONS
    const getUsers = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/get_all`,
            headers: {
              "Content-Type": "application/json",
            }
          })
            .then((res) => {
                console.log(res.data.results);
                if(res.data.results) {
                    setUnregisteredUsers((res.data.results)?.filter(us => us?._id !== ovsUser?._id));
                } else {
                    setUnregisteredUsers([]);
                } 
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const acceptUser = (id) => {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/register/${id}`,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
                if(res.data.results) {
                    getUsers();
                } 
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const rejectUser = (id) => {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/users/reject/${rejectID}/${ovsUser?._id}`,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
                if(res.data.results) {
                    getUsers();
                } 
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    // USEEFFECTS
    useEffect(()=> {
        getUsers();
    },[])
    return (
        <div style={{marginTop:"5rem"}}>
            <div>
                <Dialog
                    open={openConfirm}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                    {"Confirmation Message"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reject this user?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button autoFocus onClick={()=> {
                        handleCloseConfirm();
                        setRejectID(null);
                    }}>
                        Disagree
                    </Button>
                    <Button onClick={()=> {
                        handleCloseConfirm();
                        rejectUser();
                    }} autoFocus>
                        Agree
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
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
            <div>
                <Paper>
                    <TableContainer component={Paper} elevation={1} sx={{ height: 500,marginTop:"2rem" }}>
                        <Table stickyHeader aria-label="a simple table" size='medium'>
                            <TableHead>
                            <TableRow hover>
                                <TableCell style={{color:"white",backgroundColor:"#ff2c7f"}}>Username</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Email</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { unregisteredUsers?.length > 0 ? unregisteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => (
                                <TableRow key={row._id} hover>
                                    <TableCell component="th" scope="row">{row?.username}</TableCell>
                                    <TableCell align="left">{row?.email}</TableCell>
                                    <TableCell align="left">
                                        <Grid container spacing={2}>
                                            <Grid item xs={2}>
                                                <Button
                                                    disabled={row?.registered}
                                                    size='small'
                                                    onClick={() => {
                                                        acceptUser(row?._id);
                                                    }}
                                                    variant="contained"
                                                    style={row?.registered ? {backgroundColor:"gray",color:"white"} : {backgroundColor:"#653df5",color:"white"}}
                                                    >
                                                    {row?.registered ? "ACCEPTED" : "ACCEPT"}
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                            {
                                                row?.registered && 
                                                <Button
                                                    size='small'
                                                    onClick={() => {
                                                        setRejectID(row?._id);
                                                        handleClickOpenConfirm();
                                                    }}
                                                    variant="contained"
                                                    style={{marginLeft:"1rem", backgroundColor:"#e64942",color:"white"}}
                                                    >
                                                    REJECT
                                                </Button>
                                            }
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow> 
                            )) : 
                            <TableRow>
                                    <TableCell colSpan={4} style={{textAlign:"center"}}>No Data</TableCell>
                            </TableRow>
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={unregisteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </div>
    );
};

export default AcceptUser;