import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from 'react-router-dom';
import Courses from './Courses';
import Exams from './Exams';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Codes from './Codes';
import SchoolIcon from '@mui/icons-material/School';
import Results from './Results';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import AcceptUser from './AcceptUser';
import PasswordIcon from '@mui/icons-material/Password';
import ChangePassword from './ChangePassword';
import { ParentContext } from '../App';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color:"#343c97",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [index,setIndex] = React.useState(0);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Context
  const {ovsUser,setOvsUser} = React.useContext(ParentContext);
  React.useEffect(()=>{
    navigate("/home");
  },[])
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{backgroundColor:"#343c97",}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Phitron Copy Detector
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader style={{ justifyContent:"space-evenly"}}>
        <img src="/phitron.png" alt="" style={{width:"30%"}} />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Courses', 'Exams', 'Detect Copy', 'Previous Result'].map((text, index1) => (
            <ListItem style={index1 === index ? {backgroundColor:"#ced2d8"} : {}} key={text} disablePadding>
              <ListItemButton onClick={()=> {
                if(index1===0) {
                  setIndex(0);
                } else if(index1===1) {
                  setIndex(1);
                } else if(index1===2) {
                  setIndex(2);
                } else if(index1===3) {
                  setIndex(3);
                }
              }}>
                <ListItemIcon>
                  {index1 === 0 ? <MenuBookIcon/> : index1 === 1? <RateReviewIcon/> : index1 === 2 ? <FileCopyIcon/> : <SchoolIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Accept User', 'Change Password', 'Logout'].map((text, index1) => (
            <ListItem style={index1+4 === index ? {backgroundColor:"#ced2d8"} : {}} key={text} disablePadding>
              <ListItemButton onClick={()=> {
                if(index1===0) {
                  setIndex(4);
                } else if(index1===1) {
                  setIndex(5);
                } else if(index1===2) {
                    localStorage.removeItem("ovs_user");
                    navigate("/login");
                    setOvsUser(null);
                }
              }}>
                <ListItemIcon>
                  {index1 === 0 ? <SwipeRightIcon /> : index1 === 1 ? <PasswordIcon/> :  <ExitToAppIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        {
          index === 0 ? <Courses/> : index===1 ? <Exams/> : index === 2 ? <Codes/> : index === 3 ? <Results/> : index === 4 ? <AcceptUser/> : <ChangePassword/>
        }
      </Main>
    </Box>
  );
}
