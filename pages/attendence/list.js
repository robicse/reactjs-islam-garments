
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import tableIcons from 'components/table_icon/icon';
import useSWR, { useSWRInfinite } from "swr";
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import Gurd from '../../components/guard/Gurd';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Grid,TextField} from '@material-ui/core';
import { baseUrl } from '../../const/api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// import Edit from '../../components/admin/attendance/edit';
// import Create from '../../components/admin/attendance/create';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0',
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF',
    },
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = 'Attendance';
const subject = 'attendance';
const endpoint = {
  list: 'attendance_list',
  create: 'attendance_create',
  edit: 'attendance_edit',
  delete: 'attendance_delete',
};

const AttendanceList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [storeList, setStoreList] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [defaultData, setDefaultData] = useState(true);
  const [findData, setFindData] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };

  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };


  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const fetcher = (url, auth) =>
    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + auth },
      })
      .then((res) => res.data);

  const url = `${baseUrl}/${endpoint.list}`;
  const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);



const fetchStoreList = async() => {
try {
  const storeListUrl = `${baseUrl}/store_list`;
  const response = await axios.get(storeListUrl,{
headers: { Authorization: 'Bearer ' +  user.auth_token },
  })
 
  setStoreList(response?.data?.data)
} catch (error) {
  console.log(error)
}

}



const findAttendance = async() => {
try {
  const findAbundanceRes = await axios
  .get(
    `${baseUrl}/${endpoint.list}?from_date=${from}&to_date=${to}&store_id=${selectedStore}`,
    {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    }
  )
  setFindData(findAbundanceRes.data.response.attendances)
  setDefaultData(false)
} catch (error) {
  console.log(error)
}

 
};




useEffect(() => {
  // fetchStoreList()

}, [])

  const columns = [
    { title: 'Name', field: 'employee_name' },
    { title: 'Date', field: 'date' },
    { title: 'On Duty', field: 'on_duty' },
    { title: 'Off Duty', field: 'off_duty' },
    { title: 'Clock In', field: 'clock_in' },
    { title: 'Clock Out', field: 'clock_out' },
    { title: 'Late', field: 'late' },
    { title: 'Status', field: 'status' },
  ];

  const handleDelete = async (row_id) => {
    if (!user.can('delete', subject)) {
      setOpenWarning(true);
      return null;
    }
    const dlt = await axios.post(
      `${baseUrl}/${endpoint.delete}`,
      {
        employee_office_information_id: row_id,
      },
      {
        headers: { Authorization: 'Bearer ' + user.auth_token },
      }
    );
    mutate();
  };
  const handleEdit = (row) => {
    if (!user.can('edit', subject)) {
      setOpenWarning(true);
      return null;
    }
    console.log(row);
    setEditData(row);
    setOpenEditModal(true);
  };
  const handleCreate = () => {
    if (!user.can('create', subject)) {
      setOpenWarning(true);
      return null;
    }
    handleClickOpenCreate(true);
  };
  return (
    <div>




<Grid container spacing={1}>
            <Grid item xs={3}>
              <Box>
                <TextField
                  id="standard-helperText"
                  type="date"
                  fullWidth={true}
                  variant="outlined"
                  helperText="Form"
                  onChange={(e) => setFrom(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <TextField
                  id="standard-helperText"
                  type="date"
                  fullWidth={true}
                  variant="outlined"
                  helperText="To"
                  onChange={(e) => setTo(e.target.value)}
                />
              </Box>
            </Grid>
     
              <Grid item xs={3}>
              
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Select Employee"
                    fullWidth={true}
                    variant="outlined"
                    value={selectedStore}
                    // onChange={(e) => setSelectedStore(e.target.value)}
                    >
                    {/* <MenuItem value={0}>All</MenuItem>
                    {storeList &&
                      storeList.map((st) => (
                        <MenuItem value={st.id}>{st.store_name}</MenuItem>
                      ))} */}
                  </TextField>
    
              </Grid>
          
            <Grid item xs={3}>
              <Button
                style={{marginTop:"10px"}}
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={findAttendance}
                >
                Find
              </Button>
            </Grid>
          </Grid>

      <GridContainer>
        






        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>{title} List</h4>
      
                  </Box>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  spacing={3}
                  direction="row"
                  justify="flex-end"
                  alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}>
                    Create {title}
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>

            </CardBody>
          </Card>
          {/* <Dialog
            fullScreen
            open={openCreateModal}
            onClose={handleCloseCreate}
            TransitionComponent={Transition}>
            <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseCreate}
                  aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Create {title}
                </Typography>
              </Toolbar>
            </AppBar>
            <Create
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              mutate={mutate}
            />
          </Dialog> */}
{/* 
          <Dialog
            open={openEditModal}
            onClose={handleCloseEdit}
            TransitionComponent={Transition}>
            <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseEdit}
                  aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Edit {title}
                </Typography>
              </Toolbar>
            </AppBar>
            <Edit
              token={user.auth_token}
              modal={setOpenEditModal}
              editData={editData}
              endpoint={endpoint.edit}
              mutate={mutate}
            />
          </Dialog> */}
        </GridItem>
      </GridContainer>

    </div>
  );
});

export default AttendanceList;
