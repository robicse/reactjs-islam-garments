import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import cogoToast from "cogo-toast";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import RefreshIcon from "@material-ui/icons/Refresh";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import { Box, Grid, Chip } from "@material-ui/core";
import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";
import CreateWholesaleCustomer from "../../components/admin/whole_sale_customer/create";
import EditWholesaleCustomer from "../../components/admin/whole_sale_customer/edit";
import { baseUrl, webUrl } from "../../const/api";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import MaterialTable from "material-table";
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

const title = "Whole Sale Customer";
const subject = "Wholesale Customer";
const endpoint = {
  list: "whole_sale_customer_list_pagination_with_search",
  create: "whole_customer_create",
  edit: "customer_update",
  delete: "customer_delete",
};

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openNidPopUp, setNidPopUp] = useState(false);

  const [imageList, setImageList] = useState(null);

  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };
  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

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

  // popup open

  const handleOncickImagePopIp = (nid1, nid2, image, bankDetailsImage) => {
    setImageList({ nid1, nid2, image, bankDetailsImage });
    setNidPopUp(true);
  };
  // popup close
  const handleNidPopUpClose = () => {
    setNidPopUp(!openNidPopUp);
  };

  // handle Delette
  const handleDelete = async (row_id) => {
    if (!user.can("Delete", subject)) {
      cogoToast.warn("You don't have permission!", {
        position: "top-right",
        bar: { size: "10px" },
      });
      return null;
    }

    try {
      await axios.post(
        `${baseUrl}/${endpoint.delete}`,
        {
          store_id: row_id,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      );
      cogoToast.success("Delete Success", {
        position: "top-right",
        bar: { size: "10px" },
      });
      handleRefress();
    } catch (error) {
      AllApplicationErrorNotification(error?.response?.data);
    }
  };

  const columns = [
    { title: "Name", field: "name" },
    { title: "Code", field: "code" },
    { title: "Phone", field: "phone" },
    { title: "Address", field: "address" },
    { title: "Initial Due", field: "initial_due" },
    // { title: "Total Amount", field: "sale_total_amount" },
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

  return (
    <Gurd subject={subject}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={3} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>{title} List</h4>
                  </Box>
                </Grid>
                <Grid
                  container
                  item
                  xs={9}
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
                    Create Whole Sale Customer
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              <MaterialTable
                icons={tableIcons}
                title="LIST"
                columns={columns}
                tableRef={tableRef}
                data={(query) =>
                  new Promise((resolve, reject) => {
                    console.log(query);
                    let url = `${baseUrl}/${endpoint.list}?`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`;
                    }
                    //sorting
                    if (query.orderBy) {
                      url += `&sort=${query.orderBy.field}&order_by=${query.orderDirection}`;
                    }

                    url += `&page=${query.page + 1}`;
                    fetch(url, {
                      method: "post",
                      headers: { Authorization: "Bearer " + user.auth_token },
                    })
                      .then((resp) => resp.json())
                      .then((resp) => {
                        console.log(resp);
                        resolve({
                          data: resp.data,
                          page: resp?.meta?.current_page - 1,
                          totalCount: resp?.meta?.total,
                        });
                      });
                  })
                }
                actions={[
                  {
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="primary"
                      >
                        <ListAltTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "View NID",
                    onClick: (event, rowData) =>
                      handleOncickImagePopIp(
                        rowData?.nid_front,
                        rowData?.nid_back,
                        rowData?.image,
                        rowData?.bank_detail_image
                      ),
                  },
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
                    tooltip: "Edit  Customer",
                    onClick: (event, rowData) => handleEdit(rowData),
                  },

                  (rowData) => ({
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="secondary"
                      >
                        <DeleteForeverTwoToneIcon
                          fontSize="small"
                          color="white"
                        />
                      </Button>
                    ),
                    tooltip: "Delete Customer",
                    onClick: (event, rowData) => (
                      confirm("You want to delete " + rowData.name),
                      handleDelete(rowData.id)
                    ),
                  }),
                  {
                    icon: RefreshIcon,
                    tooltip: "Refresh Data",
                    isFreeAction: true,
                    onClick: () => handleRefress(),
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,

                  pageSize: 12,
                  pageSizeOptions: [12],

                  padding: "dense",
                }}
                detailPanel={(rowData) => {
                  return (
                    <div style={{ padding: "3px", textAlign: "justify" }}>
                      {rowData.note ? rowData.note : "No Description"}
                    </div>
                  );
                }}
                onRowClick={(event, rowData, togglePanel) => togglePanel()}
              />
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
                  Create Wholesale Customer
                </Typography>
              </Toolbar>
            </AppBar>
            <CreateWholesaleCustomer
              token={user.auth_token}
              modal={setOpenCreateModal}
              mutate={handleRefress}
              endpoint={endpoint}
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
            <EditWholesaleCustomer
              token={user.auth_token}
              modal={setOpenEditModal}
              editData={editData}
              mutate={handleRefress}
              endpoint={endpoint}
            />
          </Dialog>

          <Dialog
            onClose={handleNidPopUpClose}
            aria-labelledby="customized-dialog-title"
            open={openNidPopUp}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={handleNidPopUpClose}
            >
              Image
            </DialogTitle>
            <DialogContent dividers>
              <div style={{ display: "flex" }}>
                <img
                  src={`${webUrl}/uploads/suppliers/${imageList?.nid1}`}
                  alt="mid"
                  style={{ height: "300px", marginRight: "10px" }}
                />
                <img
                  src={`${webUrl}/uploads/suppliers/${imageList?.nid2}`}
                  alt="mid"
                  style={{ height: "300px", marginRight: "10px" }}
                />
                <img
                  src={`${webUrl}/uploads/suppliers/${imageList?.image}`}
                  alt="mid"
                  style={{ height: "300px", marginRight: "10px" }}
                />
                <img
                  src={`${webUrl}/uploads/suppliers/${imageList?.bankDetailsImage}`}
                  alt="mid"
                  style={{ height: "300px", marginRight: "10px" }}
                />
              </div>
              <div></div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleNidPopUpClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </GridItem>
      </GridContainer>
    </Gurd>
  );
});

export default TableList;
