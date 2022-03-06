import React from "react";
import { useState } from "react";
import cogoToast from "cogo-toast";
import { makeStyles } from "@material-ui/core/styles";
import tableIcons from "components/table_icon/icon";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
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
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
//import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";
import useSWR from "swr";
import { baseUrl } from "const/api";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import Edit from "components/admin/store/edit";
import Create from "components/admin/store/create";
// import AllApplicationErrorNotification from "components/utils/errorNotification";

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

const title = "Store";
const subject = "Store";
const endpoint = {
  list: "store_list",
  create: "store_create",
  edit: "store_edit",
  delete: "store_delete",
};

const StoreListComponent = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
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
    { title: "Name", field: "store_name" },
    { title: "Phone", field: "phone" },
    { title: "Email", field: "email" },
    { title: "Address", field: "address" },
    {
      title: "Status",
      field: "status",
      render: (rowData) => (
        <Chip
          color={rowData.status ? "primary" : "secondary"}
          size="small"
          label={rowData.status ? "Active" : "Inactive"}
          icon={rowData.status ? <CheckCircleIcon /> : <ErrorIcon />}
        />
      ),
    },
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

  // handle Delette
  // const handleDelete = async (row_id) => {
  //   if (!user.can("Delete", subject)) {
  //     cogoToast.warn("You don't have permission!", {
  //       position: "top-right",
  //       bar: { size: "10px" },
  //     });
  //     return null;
  //   }

  //   try {
  //     await axios.post(
  //       `${baseUrl}/${endpoint.delete}`,
  //       {
  //         store_id: row_id,
  //       },
  //       {
  //         headers: { Authorization: "Bearer " + user.auth_token },
  //       }
  //     );
  //     cogoToast.success("Delete Success", {
  //       position: "top-right",
  //       bar: { size: "10px" },
  //     });
  //     mutate();
  //   } catch (error) {
  //     AllApplicationErrorNotification(error?.response?.data);
  //   }
  // };

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
                    //       color="secondary"
                    //     >
                    //       <DeleteForeverTwoToneIcon
                    //         fontSize="small"
                    //         color="white"
                    //       />
                    //     </Button>
                    //   ),
                    //   tooltip: "Delete Party",
                    //   onClick: (event, rowData) => (
                    //     confirm("You want to delete " + rowData.store_name),
                    //     handleDelete(rowData.id)
                    //   ),
                    // }),
                  ]}
                  options={{
                    actionsColumnIndex: -1,

                    search: true,
                    pageSize: 12,
                    pageSizeOptions: [12],
                    padding: "dense",
                  }}
                />
              )}
            </CardBody>
          </Card>
          <Dialog
            // fullScreen
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

export default StoreListComponent;
