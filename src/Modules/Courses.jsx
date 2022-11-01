import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, ListItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IoIosAddCircle } from "react-icons/io";
import axios from 'axios';
import { apiBaseUrl } from '../config';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AiOutlineSearch, AiFillEdit,AiFillDelete } from "react-icons/ai";
import TagFacesIcon from '@mui/icons-material/TagFaces';

const Courses = () => {
    // STATES
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
        
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newCourseName,setNewCourseName] = useState("");
    const [dialogText,setDialogText] = useState("");
    const [courseSearchName,setCourseSearchName] = useState("");
    const [courseSearchNameIsUsed,setCourseSearchNameIsUsed] = useState(false);
    const [allCourses,setAllCourses] = useState([]);
    const [courseNameEdit,setCourseNameEdit] = useState(false);
    const [selectedCourse,setSelectedCourse] = useState(null);
    const [deleteID,setDeleteID] = useState(null);

    // HELPER FUNCTIONS
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };
    
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    // DATA FUCNTIONS 
    const addNewCourse = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/courses/new`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                coursename: newCourseName,
                exams: [],
            }),
          })
            .then((res) => {
                if(res.data) {
                    setDialogText("Course Created Successfully");
                    handleOpen();
                    getAllCourses();
                    setNewCourseName("");
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const deleteCourse = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/courses/delete/${deleteID}`,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
                if(res.data) {
                    setDialogText("Course Deleted Successfully");
                    handleOpen();
                    getAllCourses();
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const updateCourse = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/courses/modify/${selectedCourse?._id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                coursename: newCourseName,
                exams: selectedCourse?.exams,
            }),
          })
            .then((res) => {
                if(res.data) {
                    setDialogText("Modified Course Successfully");
                    handleOpen();
                    getAllCourses();
                    setNewCourseName("");
                    setCourseNameEdit(false);
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const getAllCourses = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/courses/get_all_populated`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                coursename: courseSearchName,
                coursenameisused: courseSearchNameIsUsed,
            }),
          })
            .then((res) => {
                if(res.data.results) {
                    setAllCourses(res.data.results);
                } else {
                    setAllCourses([]);
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }

    // USEEFFECTS
    useEffect(()=> {
        getAllCourses();
    },[])
    return (
        <div style={{marginTop:"5rem"}}>
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={openConfirm}
                    onClose={handleCloseConfirm}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                    {"Confirmation Message"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this course? All exams related to this course will be deleted also.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button autoFocus onClick={()=> {
                        handleCloseConfirm();
                        setDeleteID(null);
                    }}>
                        Disagree
                    </Button>
                    <Button onClick={()=> {
                        handleCloseConfirm();
                        deleteCourse();
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
                        {dialogText}
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
                {/* Create Course Part */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="standard-required"
                            label="Course Name"
                            variant="outlined"
                            size='small'
                            value={newCourseName}
                            onChange={e=> {
                                setNewCourseName(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            disabled={newCourseName.length === 0}
                            size='medium'
                            onClick={() => {
                                courseNameEdit? updateCourse() : addNewCourse();
                            }}
                            variant="contained"
                            style={{backgroundColor:"#653df5",color:"white"}}
                            >
                             {courseNameEdit? "UPDATE" : "ADD"}
                        </Button>
                        {
                            courseNameEdit && 
                            <Button
                                disabled={newCourseName.length === 0}
                                style={{marginLeft:"5px"}}
                                size='medium'
                                onClick={() => {
                                    setCourseNameEdit(false);
                                    setNewCourseName("");
                                }}
                                variant="outlined"
                                color='error'
                                >
                                CANCEL
                            </Button>
                        }
                    </Grid>
                </Grid>
                <Typography fontWeight="bold" style={{marginTop:"3rem",marginBottom:"1rem",paddingTop:"10px",paddingBottom:"10px",textAlign:"center",fontSize:"1.2rem",backgroundColor:"#343c97",color:"white",borderRadius:"10px"}}>All Courses</Typography>
                <Grid container spacing={2} alignItems="center" style={{marginBottom:0}}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            id="standard-required"
                            label="Search Course Name"
                            variant="outlined"
                            size='small'
                            value={courseSearchName}
                            onChange={e=> {
                                setCourseSearchName(e.target.value);
                                setCourseSearchNameIsUsed(Boolean(e.target.value));
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            size='large'
                            onClick={() => {
                                getAllCourses();
                            }}
                            variant="contained"
                            style={{backgroundColor:"#653df5",color:"white"}}
                            >
                             <AiOutlineSearch style={{fontSize:"1.3rem"}}></AiOutlineSearch>
                        </Button>
                    </Grid>
                </Grid>
                <Paper>
                    <TableContainer component={Paper} elevation={1} style={{marginTop:"1rem"}} sx={{ height: 300 }}>
                        <Table stickyHeader aria-label="a simple table" size='medium'>
                            <TableHead>
                            <TableRow hover>
                                <TableCell style={{color:"white",backgroundColor:"#ff2c7f"}}>Actions</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Course Name</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Exams</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { allCourses?.length === 0 ? <TableRow>
                                    <TableCell colSpan={4} style={{textAlign:"center"}}>No Data</TableCell>
                            </TableRow> : 
                            allCourses?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => (
                                <TableRow key={row._id} hover>
                                    <TableCell component="th" scope="row">
                                        <Grid container spacing={1} justifyContent="flex-start">
                                            <Grid item xs={10} sm={6} lg={3}>
                                                <Button
                                                    size='small'
                                                    onClick={() => {
                                                        setNewCourseName(row?.coursename);
                                                        setCourseNameEdit(true);
                                                        setSelectedCourse(row);
                                                    }}
                                                    variant="contained"
                                                    style={{backgroundColor:"#653df5",color:"white"}}
                                                    >
                                                    <AiFillEdit style={{fontSize:"1rem"}}></AiFillEdit>
                                                </Button>
                                            </Grid>
                                            <Grid item lg={6} sm={6} xs={6}>
                                                <Button
                                                    size='small'
                                                    onClick={() => {
                                                        setDeleteID(row?._id);
                                                        handleClickOpenConfirm();
                                                    }}
                                                    variant="contained"
                                                    style={{backgroundColor:"#e64942",color:"white"}}
                                                    >
                                                    <AiFillDelete style={{fontSize:"1rem"}}></AiFillDelete>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="left" style={{fontWeight:"500",fontSize:"1rem"}} >{row?.coursename}</TableCell>
                                    <TableCell align="left">
                                        <div>
                                            {row?.exams?.map((data) => {
                                                return (
                                                        <Chip
                                                            size='small'
                                                            style={{marginRight:"5px", backgroundColor:"#ff2c7f",color:"white",fontWeight:"bold",fontSize:"0.8rem",padding:"0.8rem"}}
                                                            icon
                                                            label={data?.examname}
                                                        />
                                                    );
                                            })}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={allCourses.length}
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

export default Courses;