import React from 'react';
import { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import Gurd from '../../components/guard/Gurd';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import cogoToast from 'cogo-toast'
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Chip, Grid } from '@material-ui/core';
import Create from '../../components/admin/role/create';
import useSWR from 'swr';
import Edit from '../../components/admin/role/edit';
import { Swrloader } from '../../components/loader/Swrloader';
import { baseUrl } from '../../const/api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import tableIcons from 'components/table_icon/icon';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
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

const title = 'Role';
const subject = 'role';
const endpoint = {
  list: 'roles',
  create: 'role_permission_create',
  edit: 'role_permission_update',
  delete: 'user_delete',
};

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);

  // const handleClickWarning = () => {
  //   setOpenWarning(true);
  // };
  // const handleCloseWarning = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpenWarning(false);
  // };

  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  const handleClickOpenEdit = () => {
    setOpenEditModal(true);
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

  const columns = [
    { title: 'Name', field: 'name' },
    {
      title: 'Permission',
      field: 'permissions',
      render: (rowData) =>
        rowData.permissions.map((per) => (
          <Chip
            key={per.id}
            color="primary"
            size="small"
            label={per.name}
            icon={<CheckCircleIcon />}
            style={{ margin: 4 }}
          />
        )),
    },
  ];

  const handleDelete = async (row_id) => {
    if (!user.can('delete', subject)) {
      cogoToast.warn("You dont't have permission!",{position: 'top-right', bar:{size: '10px'}});
      return null;
    }
    const dlt = await axios.post(
      `${baseUrl}/${endpoint.delete}`,
      {
        user_id: row_id,
      },
      {
        headers: { Authorization: 'Bearer ' + user.auth_token },
      }
    );
    mutate();
  };
  const handleEdit = (row) => {
    if (row.name == 'customer') {
      cogoToast.warn("You dont't have permission!",{position: 'top-right', bar:{size: '10px'}});
      return null;
    }
    if (!user.can('edit', subject)) {
      cogoToast.warn("You dont't have permission!",{position: 'top-right', bar:{size: '10px'}});
      return null;
    }
    console.log(row);
    setEditData(row);
    setOpenEditModal(true);
  };
  const handleCreate = () => {
    if (!user.can('create', subject)) {
      cogoToast.warn("You dont't have permission!",{position: 'top-right', bar:{size: '10px'}});
      return null;
    }
    handleClickOpenCreate(true);
  };
  return (
    <Gurd subject={subject}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={1}>
                    <h4 className={classes.cardTitleWhite}>{title} List</h4>
                    <p className={classes.cardCategoryWhite}>
                      Details {title} List
                    </p>
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
              {data && (
                <MaterialTable
                  icons={tableIcons}
                  title="List"
                  columns={columns}
                  data={data.data}
                  actions={[
                    {
                      icon: () => (
                        <Button
                          fullWidth={true}
                          variant="contained"
                          color="primary">
                          <EditTwoToneIcon fontSize="small" color="white" />
                        </Button>
                      ),
                      tooltip: 'Change Permission for this role',
                      onClick: (event, rowData) => handleEdit(rowData),
                    },
                  ]}
                  options={{
                    actionsColumnIndex: -1,
                    // exportButton: true,
                    // grouping: true,
                    search: true,
                    pageSize: 15,
                    pageSizeOptions: [5, 10, 15, 20, 30],
                    padding: 'dense',
                  }}
                />
              )}
            </CardBody>
          </Card>
          <Dialog
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
          </Dialog>

          <Dialog
            open={openEditModal}
            onClose={handleCloseEdit}
            TransitionComponent={Transition}
            maxWidth="lg">
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
          </Dialog>
        </GridItem>
      </GridContainer>
  
    </Gurd>
  );
});

export default TableList;
