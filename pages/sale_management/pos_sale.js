import React from "react";
import { useState } from "react";
import MaterialTable from "material-table";
import cogoToast from 'cogo-toast';
import tableIcons from "components/table_icon/icon";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Link from "next/link";

import {
  Box,
  Grid,
} from "@material-ui/core";
import { baseUrl } from "../../const/api";
// import Edit from "../../components/admin/product_pos_sale/edit";
// import Create from "../../components/admin/product_pos_sale/create";
// import Details from "../../components/admin/product_pos_sale/details";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useReactToPrint } from "react-to-print";
// import PossaleInvoicePrint from "components/admin/product_pos_sale/possaleinvoicePrint";
import useStatePromise from "hooks/use-state-promise";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import { convertFristCharcapital } from "../../helper/getMonthToNumber";
import { dateFormatWithTime } from 'helper/dateFormat'

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
  searchRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  input: {
    marginLeft: 3,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
};

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = "Stock Out (POS)";
const subject = "product_pos_sale";
const endpoint = {
  list: "product_pos_sale_list",
  create: "product_pos_sale_create",
  edit: "product_pos_sale_edit",
  delete: "product_pos_sale_delete",
};

const ProductPossale = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };


  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [invoiceData, setInvoicedata, setInvoicedataPromise] =
    useStatePromise(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);


 

  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };


  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };


  const handleCloseDetail = () => {
    setOpenDetailModal(false);
  };


  const handleEdit = (row) => {
    if (!user.can("edit", subject)) {
      cogoToast.warn("You don't have permission!",{position: 'top-right', bar:{size: '10px'}});
      return null;
    }
    //console.log(row);
    setEditData(row);
    setOpenEditModal(true);
  };
  const handleCreate = () => {
    // if (!user.can("create", subject)) {
    //   cogoToast.warn("You don't have permission!",{position: 'top-right', bar:{size: '10px'}});
    //   return null;
    // }
    handleClickOpenCreate(true);
  };
  // const handleDetail = (row) => {
  //   setEditData(row);
  //   setOpenDetailModal(true);
  // };





  const columns = [
    { title: "Invoice No", render: (rowData) => convertFristCharcapital(rowData.invoice_no)},
    { title: "Customer Name", field: "customer_name" },
    { title: "Total Amount", field: "total_amount" },
    { title: "Sale Date Time", field: "sale_date_time", render: (rowData) => dateFormatWithTime(rowData.sale_date_time)},
    {title: "Seller Name",field: "user_name"},
    {title: "Store Name",field: "store_name"},
  ];

  

  // const handleDelete = async (row_id) => {
  //   if (!user.can("delete", subject)) {
  //     setOpenWarning(true);
  //     return null;
  //   }
  //   const dlt = await axios.post(
  //     `${baseUrl}/${endpoint.delete}`,
  //     {
  //       product_sale_id: row_id,
  //     },
  //     {
  //       headers: { Authorization: "Bearer " + user.auth_token },
  //     }
  //   );
  //   paginateProducts();
  // };

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
    // <Gurd subject={subject}>
    <div>
      {/* <div style={{ display: "none" }}>
        <PossaleInvoicePrint
          ref={componentRef}
          inv={invoiceData}
          invoiceProduct={invoiceProduct}
        />
      </div> */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Box py={1}>
                <Grid container spacing={1}>
                  <Grid container item xs={6} spacing={3} direction="column">
                    <Box p={1}>
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
              </Box>
            </CardHeader>
            <CardBody>

            <MaterialTable
                icons={tableIcons}
                title="List"
                tableRef={tableRef}
                columns={columns}

                data={query =>
                  new Promise((resolve, reject) => {
                   
                    let url = `${baseUrl}/product_pos_sale_list_pagination_with_search?`
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`
                    }
                  
                    url += `&page=${query.page + 1}`
                    fetch(url,{
                          method: "POST",
                          headers: { Authorization: "Bearer " + user.auth_token },
                        }
                      ).then(resp => resp.json()).then(resp => {
         
                        
                      resolve({
                            data: resp?.data,
                            page:  resp?.meta?.current_page - 1,
                            totalCount: resp?.meta?.total,
                      });
                    })
        
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
                        <PrintTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Print",
                    // onClick: (event, rowData) => handlePrint(rowData, false),
                  },

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
                  rowStyle: {
                    fontSize: 17,
                  },
                }}

      
              />
             
            
      
            </CardBody>
          </Card>
          {/* <Dialog
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
                <Link href="/product_pos_sale/list">
                  <a target="_blank">
                    <Button variant="contained">Sale in new Tab</Button>
                  </a>
                </Link>
              </Toolbar>
            </AppBar>
            <Create
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              mutate={handleRefress}
              handlePrint={handlePrint}
              user={user}
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
                  Edit {title}
                </Typography>
                <Link href="/product_pos_sale/lis">
                  <a target="_blank">
                    <Button variant="contained">Sale in new Tab</Button>
                  </a>
                </Link>
              </Toolbar>
            </AppBar>
            <Edit
              token={user.auth_token}
              modal={setOpenEditModal}
              editData={editData}
              endpoint={endpoint.edit}
              mutate={handleRefress}
            />
          </Dialog>
          <Dialog
            open={openDetailModal}
            onClose={handleCloseDetail}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg"
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
          </Dialog> */}
        </GridItem>
      </GridContainer>
  
      </div>
  );
});

export default ProductPossale;

