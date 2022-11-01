import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../config';
import { AiOutlineSearch, AiFillEdit,AiFillDelete } from "react-icons/ai";
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


const initialQuery = {
    courseref: null,
    courserefisused: false,
    examname: "",
    examnameisused: false,
}
const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));
const Exams = () => {
    // STATES
    const [open, setOpen] = useState(false);
    const [allCourses,setAllCourses] = useState([]);
    const [dialogText,setDialogText] = useState("");
    const [selectedCourse,setSelectedCourse] = useState(null);
    const [newExamName,setNewExamName] = useState("");
    const [numberOfQuestionsContest,setNumberOfQuestionsContest] = useState(0);
    const [numberOfQuestionsWritten,setNumberOfQuestionsWritten] = useState(0);
    const [examEdit,setExamEdit] = useState(false);
    const [selectedExam,setSelectedExam] = useState(null);
    const [searchQuery,setSearchQuery] = useState(initialQuery);
    const [allExams,setAllExams] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteID,setDeleteID] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
    const getAllCourses = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/courses/get_all`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                coursename: "",
                coursenameisused: false,
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
    const getAllExams = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/exams/get_all_populated`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({...searchQuery,courseref: searchQuery.courseref?._id}),
          })
            .then((res) => {
                if(res.data.results) {
                    setAllExams(res.data.results);
                } else {
                    setAllExams([]);
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const addNewExam = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/exams/new`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                courseref: selectedCourse?._id,
                examname: newExamName,
                numberofquestionscontest: numberOfQuestionsContest,
                numberofquestionswritten: numberOfQuestionsWritten,
            }),
          })
            .then((res) => {
                if(res.data) {
                    setDialogText("Created Exam Successfully");
                    handleOpen();
                    getAllExams();
                    setNewExamName("");
                    setSelectedCourse(null);
                    setNumberOfQuestionsContest(0);
                    setNumberOfQuestionsWritten(0);
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const updateExam = ()=> {
        axios({
            method: "POST", 
            url: `${apiBaseUrl}/exams/modify`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                courseref: selectedCourse?._id,
                examname: newExamName,
                numberofquestionscontest: numberOfQuestionsContest,
                numberofquestionswritten: numberOfQuestionsWritten,
            }),
          })
            .then((res) => {
                if(res.data) {
                    setDialogText("Created Exam Successfully");
                    handleOpen();
                    getAllExams();
                    setNewExamName("");
                    setSelectedCourse(null);
                    setNumberOfQuestionsContest(0);
                    setNumberOfQuestionsWritten(0);
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }
    const deleteExam = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/exams/delete/${deleteID}`,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
                if(res.data) {
                    setDialogText("Exam Deleted Successfully");
                    handleOpen();
                    getAllExams();
                }
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                handleOpen();
        });
    }

    //USEEFFECTS
    useEffect(()=> {
        getAllCourses();
        getAllExams();
    },[])
    return (
        <div style={{marginTop:"5rem"}}>
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={openConfirm}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                    {"Confirmation Message"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this exam?
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
                        deleteExam();
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
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Autocomplete
                            size="small"
                            value={selectedCourse}
                            onChange={(event, newValue) => {
                                newValue? setSelectedCourse(newValue) : setSelectedCourse(null);
                            }}
                            id="controllable-states-demo"
                            fullWidth
                            options={allCourses}
                            getOptionLabel={(option) => option?.coursename}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Course"
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            id="standard-required"
                            label="Exam Name"
                            variant="outlined"
                            size='small'
                            value={newExamName}
                            onChange={e=> {
                                setNewExamName(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            id="standard-required"
                            label="No of Questions (Contest)"
                            variant="outlined"
                            size='small'
                            type="number"
                            inputProps={{min:0}}
                            value={numberOfQuestionsContest}
                            onChange={e=> {
                                setNumberOfQuestionsContest(parseInt(e.target.value));
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            id="standard-required"
                            label="No of Questions (Written)"
                            variant="outlined"
                            size='small'
                            type="number"
                            inputProps={{min:0}}
                            value={numberOfQuestionsWritten}
                            onChange={e=> {
                                setNumberOfQuestionsWritten(parseInt(e.target.value));
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            disabled={newExamName.length === 0 || selectedCourse === null || (numberOfQuestionsContest === 0 && numberOfQuestionsWritten === 0)}
                            size='medium'
                            onClick={() => {
                                examEdit? updateExam() : addNewExam();
                            }}
                            variant="contained"
                            style={{backgroundColor:"#653df5",color:"white"}}
                            >
                             {examEdit? "UPDATE" : "ADD"}
                        </Button>
                        {
                            examEdit && 
                            <Button
                                disabled={newExamName.length === 0 || selectedCourse === null}
                                style={{marginLeft:"5px"}}
                                size='medium'
                                onClick={() => {
                                    setExamEdit(false);
                                    setNewExamName("");
                                    setSelectedCourse(null);
                                    setSelectedExam(null);
                                    setNumberOfQuestionsContest(0);
                                    setNumberOfQuestionsWritten(0);
                                }}
                                variant="outlined"
                                color='error'
                                >
                                CANCEL
                            </Button>
                        }
                    </Grid>
                </Grid>
                <Typography fontWeight="bold" style={{marginTop:"3rem",marginBottom:"1rem",paddingTop:"10px",paddingBottom:"10px",textAlign:"center",fontSize:"1.2rem",backgroundColor:"#343c97",color:"white",borderRadius:"10px"}}>All Exams</Typography>
                <Grid container spacing={2} alignItems="center" style={{marginBottom:0}}>
                    <Grid item xs={4}>
                        <Autocomplete
                            size="small"
                            value={searchQuery.courseref}
                            onChange={(event, newValue) => {
                                setSearchQuery({...searchQuery,courseref:newValue,courserefisused:Boolean(newValue)});
                            }}
                            id="controllable-states-demo"
                            fullWidth
                            options={allCourses}
                            getOptionLabel={(option) => option?.coursename}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search By Course"
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            id="standard-required"
                            label="Search By Exam Name"
                            variant="outlined"
                            size='small'
                            value={searchQuery.examname}
                            onChange={e=> {
                                setSearchQuery({...searchQuery,examname:e.target.value,examnameisused:Boolean(e.target.value)});
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            size='large'
                            onClick={() => {
                                getAllExams();
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
                        <Table stickyHeader aria-label="a simple table" size='large'>
                            <TableHead>
                            <TableRow hover>
                                <TableCell style={{color:"white",backgroundColor:"#ff2c7f"}}>Actions</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Course Name</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Exam Name</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>No of Questions (Contest)</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>No of Questions (Written)</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { allExams?.length === 0 ? <TableRow>
                                    <TableCell colSpan={5} style={{textAlign:"center"}}>No Data</TableCell>
                            </TableRow> : 
                            allExams?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => (
                                <TableRow key={row._id} hover>
                                    <TableCell component="th" scope="row">
                                        <Grid container spacing={1} justifyContent="flex-start">
                                            <Grid item xs={6} sm={6} lg={5}>
                                                <Button
                                                    size='small'
                                                    onClick={() => {
                                                        setNewExamName(row?.examname);
                                                        setExamEdit(true);
                                                        setSelectedExam(row);
                                                        setSelectedCourse(row?.courseref);
                                                        setNumberOfQuestionsContest(row?.numberofquestionscontest || 0);
                                                        setNumberOfQuestionsWritten(row?.numberofquestionswritten || 0);
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
                                    <TableCell align="left" style={{fontWeight:"500",fontSize:"1rem"}} >{row?.courseref?.coursename}</TableCell>
                                    <TableCell align="left" style={{fontWeight:"500",fontSize:"1rem"}}>{row?.examname}</TableCell>
                                    <TableCell align="left" style={{fontWeight:"500",fontSize:"1rem"}}>{row?.numberofquestionscontest}</TableCell>
                                    <TableCell align="left" style={{fontWeight:"500",fontSize:"1rem"}}>{row?.numberofquestionswritten}</TableCell>
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

export default Exams;