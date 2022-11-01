import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../config';
import { AiOutlineSearch, AiFillEdit,AiFillDelete } from "react-icons/ai";
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';

const initialQuery = {
    courseref: null,
    courserefisused: false,
    examname: "",
    examnameisused: false,
}

const Results = () => {
     // STATES
     const [open, setOpen] = useState(false);
     const [allCourses,setAllCourses] = useState([]);
     const [dialogText,setDialogText] = useState("");
     const [selectedCourse,setSelectedCourse] = useState(null);
     const [selectedExam,setSelectedExam] = useState(null);
     const [selectedQuestionNo,setSelectedQuestionNo] = useState(-1);
     const [email,setEmail] = useState("");
     const [code,setCode] = useState("");
     const [loading,setLoading] = useState(false);
     const [copyResults,setCopyResults] = useState([]);
     const [studentCode,setStudentCode] = useState("");
     const [questionType,setQuestionType] = useState("contest");
 
     const [page, setPage] = useState(0);
     const [rowsPerPage, setRowsPerPage] = useState(10);

 
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
 
     // DATA FUNCTIONS
     const getAllCourses = ()=> {
         axios({
             method: "POST",
             url: `${apiBaseUrl}/courses/get_all_populated`,
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
     const getResults = ()=> {
        setLoading(true);
        axios({
            method: "POST",
            url: `${apiBaseUrl}/codes/get_results`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                courseref: selectedCourse?._id,
                examref: selectedExam?._id,
                questionno: selectedQuestionNo,
                questiontype: questionType,
                email: email,
            }),
          })
            .then((res) => {
                if(res.data.results) {
                    setCopyResults(res.data.results);
                    setStudentCode(res.data.code);
                } else {
                    setCopyResults([]);
                    setStudentCode("");
                } 
                setLoading(false);
            })
            .catch((err) => {
                err?.response?.data ? setDialogText(err.response.data) : setDialogText("Something Went Wrong. Please Try Again Later!");
                setLoading(false);
                handleOpen();
        });
     }
     
 
     //USEEFFECTS
     useEffect(()=> {
         getAllCourses();
     },[])

    return (
        <div style={{marginTop:"5rem"}}>
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
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Autocomplete
                            size="small"
                            value={selectedCourse}
                            onChange={(event, newValue) => {
                                if(newValue) {
                                    setSelectedCourse(newValue);
                                    setSelectedExam(null);
                                    setSelectedQuestionNo(-1);
                                } else {
                                    setSelectedCourse(null);
                                    setSelectedExam(null);
                                    setSelectedQuestionNo(-1);
                                }
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
                    <Grid item xs={2}>
                        <Autocomplete
                            size="small"
                            value={selectedExam}
                            onChange={(event, newValue) => {
                                newValue? setSelectedExam(newValue) : setSelectedExam(null);
                                setSelectedQuestionNo(-1);
                            }}
                            id="controllable-states-demo"
                            fullWidth
                            options={selectedCourse?.exams || []}
                            getOptionLabel={(option) => option?.examname}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Exam"
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete
                            size="small"
                            value={selectedQuestionNo}
                            onChange={(event, newValue) => {
                                newValue >=0 ? setSelectedQuestionNo(newValue) : setSelectedQuestionNo(-1);
                            }}
                            id="controllable-states-demo"
                            fullWidth
                            options={questionType === "contest" ? (selectedExam?.numberofquestionscontest ? Array.from(Array(selectedExam?.numberofquestionscontest).keys()) : [-1]) : (selectedExam?.numberofquestionswritten ? Array.from(Array(selectedExam?.numberofquestionswritten).keys()) : [-1])}
                            getOptionLabel={(option) => {
                                if(option===-1) return "None";
                                else return String.fromCharCode(option+65);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Question No"
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            id="standard-required"
                            label="Student's Email"
                            variant="outlined"
                            size='small'
                            value={email}
                            onChange={e=> {
                                setEmail(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            size='large'
                            onClick={() => {
                                getResults();
                            }}
                            variant="contained"
                            style={{backgroundColor:"#653df5",color:"white"}}
                            >
                             <AiOutlineSearch style={{fontSize:"1.3rem"}}></AiOutlineSearch>
                        </Button>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <FormControlLabel control={<Switch
                                checked={questionType === "contest"}
                                onChange={()=> {
                                    questionType === "contest" ? setQuestionType("written") : setQuestionType("contest");
                                    setSelectedQuestionNo(-1);
                                }}
                                
                                inputProps={{ 'aria-label': 'controlled' }}
                            />} label={questionType}/>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <Button
                            size='small'
                            onClick={() => {
                                setDialogText(studentCode);
                                handleOpen();
                            }}
                            variant="contained"
                            style={{backgroundColor:"#653df5",color:"white"}}
                            >
                            VIEW CODE
                        </Button>
                    </Grid>
                </Grid>
                { loading? <Box sx={{ display: 'flex' ,justifyContent:"center",height: 400,marginTop:"2rem"}}>
                            <CircularProgress />
                          </Box> :
                <Paper>
                    <TableContainer component={Paper} elevation={1} sx={{ height: 400,marginTop:"2rem" }}>
                        <Table stickyHeader aria-label="a simple table" size='medium'>
                            <TableHead>
                            <TableRow hover>
                                <TableCell style={{color:"white",backgroundColor:"#ff2c7f"}}>Student Email</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Copy Percentage</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Submitted Date</TableCell>
                                <TableCell align="left" style={{color:"white",backgroundColor:"#ff2c7f"}}>Code</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { copyResults?.length > 0 ? copyResults?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => (
                                <TableRow key={row._id} hover>
                                    <TableCell component="th" scope="row">{row?.email}</TableCell>
                                    <TableCell align="left" style={{fontWeight:"500",fontSize:"1rem",color:"red"}} >{(row?.percentage)?.toFixed(2) }%</TableCell>
                                    <TableCell align="left">{new Date(row?.submitdate).toLocaleDateString()}</TableCell>
                                    <TableCell align="left">
                                        <Button
                                            size='small'
                                            onClick={() => {
                                                setDialogText(row?.code);
                                                handleOpen();
                                            }}
                                            variant="contained"
                                            style={{backgroundColor:"#653df5",color:"white"}}
                                            >
                                            VIEW CODE
                                        </Button>
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
                    count={allCourses.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            }
            </div>
        </div>
    );
};

export default Results;