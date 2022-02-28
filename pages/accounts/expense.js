import React from "react";
import { useState } from "react";
import cogoToast from "cogo-toast";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import tableIcons from "components/table_icon/icon";
// core components
import RefreshIcon from "@material-ui/icons/Refresh";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import { useAsyncEffect } from "use-async-effect";
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
import { Swrloader } from "../../components/loader/Swrloader";
import { baseUrl } from "../../const/api";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Edit from "../../components/admin/accounts/expense/edit";
import Create from "../../components/admin/accounts/expense/create";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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

const title = "Expense List";
const subject = "Expense";

const permissionObj = {
  read: "Expense List",
  create: "",
  edit: "",
  delete: "",
};

const endpoint = {
  expenseListAPi: `${baseUrl}/expense_list_pagination_with_search`,
  list: "expense_list_pagination_with_search",
  create: "expense_category_create",
  edit: "expense_category_edit",
  delete: "expense_category_delete",
};

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  //edit create state
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const columns = [
    {
      title: "Expenase Date",
      field: "date",
      //   render: (rowData) => dateFormatWithTime(rowData.date_time),
    },
    { title: "Store Name", field: "store_name" },
    { title: "Warehouse", field: "warehouse_name" },
    { title: "Expense Category", field: "expense_category_name" },
    {
      title: "Amount",
      field: "amount",
    },
  ];

  // handle create
  const handleCreate = () => {
    if (!user.can("Create", subject)) {
      cogoToast.error("You don't  have Create permission!", {
        position: "top-right",
        bar: { size: "10px" },
      });
      return null;
    }
    setOpenCreateModal(true);
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
      mutate();
    } catch (error) {
      AllApplicationErrorNotification(error?.response?.data);
    }
  };

  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
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
              <MaterialTable
                icons={tableIcons}
                title="List"
                columns={columns}
                tableRef={tableRef}
                data={(query) =>
                  new Promise((resolve, reject) => {
                    let url = `${endpoint.expenseListAPi}?`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`;
                    }

                    url += `&page=${query.page + 1}`;
                    fetch(url, {
                      method: "GET",
                      headers: { Authorization: "Bearer " + user.auth_token },
                    })
                      .then((resp) => resp.json())
                      .then((resp) => {

                        if (resp.data) {
                          resolve({
                          data: resp.data?.data,
                          page: resp?.data?.current_page - 1,
                          totalCount: resp?.data?.total,
                          });
                        }else{
                          resolve({
                            data:[],
                            page:  0,
                            totalCount:0,
                      });
                        }
                      });
                      // .then((resp) => {
                      //   resolve({
                      //     data: resp.data?.data,
                      //     page: resp?.data?.current_page - 1,
                      //     totalCount: resp?.data?.total,
                      //   });
                      // });
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
                        <EditTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Edit",
                    onClick: (event, rowData) => handleEdit(rowData),
                  },

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
                  Create {title}
                </Typography>
              </Toolbar>
            </AppBar>
            <Create
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              handleRefress={handleRefress}
            />
          </Dialog>

          <Dialog
            fullScreen
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
              handleRefress={handleRefress}
            />
          </Dialog>
        </GridItem>
      </GridContainer>
    </Gurd>
  );
});

export default TableList;
