import React from "react";
import { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
// import { useAsyncEffect } from 'use-async-effect';
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
import { Box, Grid } from "@material-ui/core";
import useSWR from "swr";
// import { Swrloader } from '../../components/loader/Swrloader';
import { baseUrl } from "../../const/api";
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Edit from "../../components/admin/chart_of_account_transaction_new/Edit";
import Create from "../../components/admin/chart_of_account_transaction_new/Create";
import Details from "../../components/admin/chart_of_account_transaction_new/details";
import tableIcons from "components/table_icon/icon";
import { useReactToPrint } from "react-to-print";
import InvoicePosPurchase from "components/admin/chart_of_account_transaction_new/Invoice_pos_purchase";
import useStatePromise from "hooks/use-state-promise";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";
// import PrintTwoToneIcon from '@material-ui/icons/PrintTwoTone';
// import ListAltTwoToneIcon from '@material-ui/icons/ListAltTwoTone';
import { dateFormatOnlyDate, dateFormatWithoutTime } from "helper/dateFormat";

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

const title = "Chart of Account";
const subject = "chart_of_account_transaction";
const endpoint = {
  list: "chart_of_account_transaction_list",
  create: "chart_of_account_transaction_create",
  edit: "chart_of_account_transaction_edit",
  delete: "chart_of_account_transaction_delete",
};

const PostingCom = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [invoiceData, setInvoicedata, setInvoicedataPromise] =
    useStatePromise(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === "clickaway") {
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

  // const handleClickOpenEdit = () => {
  //   setOpenEditModal(true);
  // };
  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  // const handleClickOpenDetail = () => {
  //   setOpenDetailModal(true);
  // };
  const handleCloseDetail = () => {
    setOpenDetailModal(false);
  };

  //   const fetcher = (url, auth) =>
  //     axios
  //       .get(url, {
  //         headers: { Authorization: "Bearer " + auth },
  //       })
  //       .then((res) => res.data);

  //   const url = `${baseUrl}/${endpoint.list}`;
  //   const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);

  const columns = [
    {
      title: "Transaction Date",
      field: "transaction_date",
      render: (rowData) => dateFormatWithoutTime(rowData.transaction_date_time),
    },
    { title: "Voucher Name", field: "voucher_type_name" },
    {
      title: "Voucher No",
      field: "voucher_no",
    },
    { title: "Description", field: "description" },
  
    // { title: "chart of account_name", field: "chart_of_account_name" },
      
    { title: "Account Name", field: "chart_of_account_name" },
      
    { title: "Credit", field: "credit" },
    { title: "Debit", field: "debit" },
  ];

  const handleDelete = async (row_id) => {
    if (!user.can("delete", subject)) {
      setOpenWarning(true);
      return null;
    }
    const dlt = await axios.post(
      `${baseUrl}/${endpoint.delete}`,
      {
        chart_of_account_transaction_id: row_id,
      },
      {
        headers: { Authorization: "Bearer " + user.auth_token },
      }
    );
    mutate();
  };
  const handleEdit = (row) => {
    // if (!user.can('edit', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    //console.log(row);
    setEditData(row);
    setOpenEditModal(true);
  };
  const handleCreate = () => {
    // if (!user.can('create', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    handleClickOpenCreate(true);
  };
  const handleDetail = (row) => {
    setEditData(row);
    setOpenDetailModal(true);
  };
  const componentRef = React.useRef(null);

  const handlePrint = async (row) => {
    await axios
      .post(
        `${baseUrl}/product_pos_sale_details`,
        {
          product_sale_id: row.id,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      )
      .then((res) => {
        const state = setInvoicedataPromise(row).then(() => {
          console.log("running promise");
        });
        setInvoiceproduct(res.data.data);
      });
    if (handlePrintInvoice) {
      handlePrintInvoice();
    }
  };
  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      {/* // <Gurd subject={subject}> */}
      <div style={{ display: "none" }}>
        {/* <InvoicePosPurchase
          ref={componentRef}
          inv={invoiceData}
          invoiceProduct={invoiceProduct}
        /> */}
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>Posting List</h4>
                    <p className={classes.cardCategoryWhite}>
                      {/* {data && data.data.length} */}
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
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                  >
                    Create Posting
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              <MaterialTable
                icons={tableIcons}
                title="List"
                columns={columns}
                //   data={data.data}

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
                    // if (query.orderBy) {
                    //   url += `&sort=${query.orderBy.field}&order_by=${query.orderDirection}`;
                    // }

                    url += `&page=${query.page + 1}`;
                    fetch(url, {
                      method: "GET",
                      headers: { Authorization: "Bearer " + user.auth_token },
                    })
                      .then((resp) => resp.json())
                      .then((resp) => {
                        console.log(resp);
                        resolve({
                          data: resp?.data?.data,
                          page: resp?.data?.current_page - 1,
                          totalCount: resp?.data?.total,
                        });
                      });
                  })
                }
                actions={[
                //   {
                //     icon: () => (
                //       <Button
                //         fullWidth={true}
                //         variant="contained"
                //         color="primary"
                //       >
                //         <EditTwoToneIcon fontSize="small" color="white" />
                //       </Button>
                //     ),
                //     tooltip: "Edit Sale",
                //     onClick: (event, rowData) => handleEdit(rowData),
                //   },
                //   (rowData) => ({
                //     icon: () => (
                //       <Button
                //         fullWidth={true}
                //         variant="contained"
                //         color="secondary"
                //       >
                //         <DeleteForeverTwoToneIcon
                //           fontSize="small"
                //           color="white"
                //         />
                //       </Button>
                //     ),
                //     tooltip: "Delete Sale",
                //     onClick: (event, rowData) => (
                //       confirm("You want to delete " + rowData.voucher_no),
                //       handleDelete(rowData.id)
                //     ),
                //     // disabled: rowData.birthYear < 2000,
                //   }),
                ]}
                options={{
                  actionsColumnIndex: -1,
                  // exportButton: true,
                  // grouping: true,
                  search: true,
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
                  Create Posting
                </Typography>
              </Toolbar>
            </AppBar>
            <Create
              user={user}
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              mutate={handleRefress}
              handlePrint={handlePrint}
            />
          </Dialog>

          <Dialog
            open={openEditModal}
            onClose={handleCloseEdit}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg"
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
                  Edit Posting
                </Typography>
              </Toolbar>
            </AppBar>
            <Edit
              user={user}
              token={user.auth_token}
              modal={setOpenEditModal}
              editData={editData}
              endpoint={endpoint.edit}
              mutate={handleRefress}
              handleCloseEdit={handleCloseEdit}
            />
          </Dialog>
          <Dialog
            open={openDetailModal}
            onClose={handleCloseDetail}
            TransitionComponent={Transition}
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseDetail}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Product details
                </Typography>
              </Toolbar>
            </AppBar>
            <Details
              token={user.auth_token}
              modal={setOpenDetailModal}
              editData={editData}
            />
          </Dialog>
        </GridItem>
      </GridContainer>
      <Snackbar
        open={openWarning}
        autoHideDuration={2000}
        onClose={handleCloseWarning}
      >
        <Alert onClose={handleCloseWarning} severity="warning">
          You don't have permission!
        </Alert>
      </Snackbar>
    </div>
  );
});

export default PostingCom;
