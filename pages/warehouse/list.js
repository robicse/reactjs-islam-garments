import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import cogoToast from "cogo-toast";
import Gurd from "components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Chip, Grid } from "@material-ui/core";
import useSWR from "swr";
import { baseUrl } from "../../const/api";
import MuiAlert from "@material-ui/lab/Alert";
import Edit from "../../components/admin/warehouse/edit";
import Create from "../../components/admin/warehouse/create";
import tableIcons from "components/table_icon/icon";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";



const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const title = "Warehouse";
  const subject = "Warehouse";
  const endpoint = {
    list: "warehouse_list",
    create: "warehouse_create",
    edit: "warehouse_edit",
    delete: "warehouse_delete",
  };

  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

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
        headers: { Authorization: "Bearer " + auth },
      })
      .then((res) => res.data);

  const url = `${baseUrl}/${endpoint.list}`;
  const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Phone", field: "phone" },
    { title: "Email", field: "email" },
    { title: "Address", field: "address" },
  ];


  // handle edit
  const handleEdit = (row) => {
    if (!user.can("Edit", subject)) {
      cogoToast.error("You don't have Edit permission!", {
        position: "top-right",
        bar: { size: "10px" },
      });
      return null;
    }
    setEditData(row);
    setOpenEditModal(true);
  };

  // handle create
  const handleCreate = () => {
    if (!user.can("Create", subject)) {
      cogoToast.error("You don't  have Create permission!", {
        position: "top-right",
        bar: { size: "10px" },
      });
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
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                  >
                    Create {title}
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              {data && (
                <MaterialTable
                  title="List"
                  icons={tableIcons}
                  columns={columns}
                  data={data.data}
                  actions={[
                    {
                      icon: () => (
                        <Button
                          fullWidth={true}
                          variant="contained"
                          color="primary"
                        >
                          <EditTwoToneIcon fontSize="small" color="white" />
                        </Button>
                      ),
                      tooltip: "Edit User",
                      onClick: (event, rowData) => handleEdit(rowData),
                    },
                    // (rowData) => ({
                    //   icon: () => (
                    //     <Button
                    //       fullWidth={true}
                    //       variant="contained"
                    //       color="secondary">
                    //       <DeleteForeverTwoToneIcon
                    //         fontSize="small"
                    //         color="white"
                    //       />
                    //     </Button>
                    //   ),
                    //   tooltip: 'Delete Party',
                    //   onClick: (event, rowData) => (
                    //     confirm('You want to delete ' + rowData.name),
                    //     handleDelete(rowData.id)
                    //   ),

                    // }),
                  ]}
                  options={{
                    actionsColumnIndex: -1,

                    // search: true,
                    pageSize: 12,
                    pageSizeOptions: [12],
                    padding: "dense",
                  }}
                />
              )}
            </CardBody>
          </Card>
          <Dialog
            fullScreen
            open={openCreateModal}
            onClose={handleCloseCreate}
            TransitionComponent={Transition}
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseCreate}
                  aria-label="close"
                >
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
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseEdit}
                  aria-label="close"
                >
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
