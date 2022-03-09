import React, { useEffect } from "react";
import { useState } from "react";
import cogoToast from "cogo-toast";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import { makeStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import RefreshIcon from "@material-ui/icons/Refresh";
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
import Slide from "@material-ui/core/Slide";
import { Box, Chip, Grid } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import tableIcons from "components/table_icon/icon";
import { useReactToPrint } from "react-to-print";
// custom component
import StockInComponent from "components/admin/warehouse_management/stockInTab";
import Details from "components/admin/common_component/details";
import StockInPrint from "components/admin/common_component/invoicePrint";
// utils component
import { convertFristCharcapital } from "helper/getMonthToNumber";
import { dateFormatWithTime } from "helper/dateFormat";
 
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

const title = "Warehouse Stock In";


const WarehouseStockIn = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

//  console.log({
//   id:user?.details?.warehouse_id,
//   name: user?.details?.warehouse_name
// })
  const subject = "Warehouse Stock In";
  const endpoint = {
    title: "Warehouse Stock",
    
    warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
    supplyerActiveListUrl: `${baseUrl}/supplier_active_list`,
    sizesActiveListUrl: `${baseUrl}/product_size_active_list`,
    unitActiveListUrl: `${baseUrl}/product_unit_active_list`,
    categoryActiveListUrl: `${baseUrl}/product_category_active_list`,
    subUnitActiveListUrl:`${baseUrl}/product_sub_unit_list`,
    paymentTypeListAPI: `${baseUrl}/payment_type_active_list`,

    stockInAPi: `${baseUrl}/product_purchase_create`,
    // stockInEditAPi: `${baseUrl}/warehouse_stock_in_edit`,
    // deleteAPi: `${baseUrl}/warehouse_stock_in_delete`,
    stockInInvoiceDetailsAPi: `${baseUrl}/warehouse_stock_in_invoice_details`,
    
    productFintByDeopDownItemAPi: `${baseUrl}/product_info_for_stock_in`,
    warehouse_stock_in: `${baseUrl}/product_list_with_search`,

    stockInListAPI: `${baseUrl}/product_purchase_list_pagination_with_search`,
    ProductdetailsUrl: `${baseUrl}/product_purchase_details`,
    printUrl: `${baseUrl}/product_purchase_details_print`,
    headers: {
      headers: {
        Authorization: "Bearer " + user?.details?.token,
        "Content-type": "application/javascript",
      },
    },
    FrpmDataheaders: {
      headers: {
        Authorization: "Bearer " + user?.details?.token,
        "Content-type": "multipart/form-data",
      },
    },
    loginWarehouse:{
      id:user?.details?.warehouse_id,
      name: user?.details?.warehouse_name,
      role:user?.role
    }
   
  };

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [defaultprintData, setDefaultPrintData] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  const handleCloseDetails = () => {
    setOpenDetailModal(false);
  };

  const handleDetails = (row) => {
    setEditData(row);
    setOpenDetailModal(true);
  };

  const columns = [
    {
      title: "Invoice No",
      render: (rowData) => convertFristCharcapital(rowData.invoice_no),
    },
    { title: "Warehouse", field: "warehouse_name" },
    { title: "Supplier", field: "supplier_name" },
    { title: "User", field: "user_name" },
    {
      title: "Date",
      field: "date_time",
      render: (rowData) => dateFormatWithTime(rowData.date_time),
    },
    {
      title: "Total(TK)",
      field: "grand_total_amount",
    },
  ];

  const componentRef = React.useRef(null);
  const handlePrint = async (row) => {

   try {
    let data = new FormData();
    data.append('product_purchase_id', JSON.stringify(row.id));
     const result = await axios.post(
        endpoint.printUrl,
        data,
        endpoint.headers
      )
      setPrintData(result.data);
      setDefaultPrintData(row);
    
      // setPrintData(result);
     
   } catch (error) {
     console.log(error)
     
   }
  };


  useEffect(()=>{
    if(printData && defaultprintData){
      console.log(printData)
      handlePrintInvoice()
    }

  },[printData,defaultprintData])


  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });

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
  
      <div style={{ display: "none" }}>
        <StockInPrint
          ref={componentRef}
          defaultprintData={defaultprintData}
          printData={printData}
          invoiceTitle="Warehouse Stock In"
        />
      </div>
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
                    let url = `${endpoint.stockInListAPI}?`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`;
                    }

                    url += `&page=${query.page + 1}`;
                    fetch(url, {
                      method: "post",
                      headers: { Authorization: "Bearer " + user.auth_token },
                    })
                      .then((resp) => resp.json())
                      .then((resp) => {
                        if (resp.data) {
                          resolve({
                            data: resp.data || [],
                            page: resp?.meta?.current_page - 1 || 0,
                            totalCount: resp?.meta?.total || 0,
                          });
                        } else {
                          resolve({
                            data: [],
                            page: 0,
                            totalCount: 0,
                          });
                        }
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
                        <PrintTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Print",
                    onClick: (event, rowData) => handlePrint(rowData),
                  },

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
                    tooltip: "Show Products",
                    onClick: (event, rowData) => handleDetails(rowData),
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
                  Stock In
                </Typography>
              </Toolbar>
            </AppBar>
            <StockInComponent
              modal={setOpenCreateModal}
              endpoint={endpoint}
              handleRefress={handleRefress}
            />
          </Dialog>

          <Dialog
            open={openDetailModal}
            onClose={handleCloseDetails}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg"
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseDetails}
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
              modal={setOpenDetailModal}
              id={editData?.id}
              endpoint={endpoint}
              //  editData={editData}
              idType="product_purchase_id"

              // modal={setOpenDetailModal}
              // endpoint={endpoint}
              // editData={editData}
            />
          </Dialog>
        </GridItem>
      </GridContainer>

      </Gurd>

  );
});

export default WarehouseStockIn;
