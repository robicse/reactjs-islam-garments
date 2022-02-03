import React from "react";
import { useState } from "react";
import cogoToast from 'cogo-toast';
import { makeStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
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
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Chip, Grid } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import Edit from "../../components/admin/product_whole_purchase/edit";
import Create from "../../components/admin/product_whole_purchase/create";
import Details from "../../components/admin/product_whole_purchase/details";
import tableIcons from "components/table_icon/icon";
import { useReactToPrint } from "react-to-print";
import WholePurchaseInvoicePrint from "components/admin/product_whole_purchase/wholePurchaseInvoicePrint";
import useStatePromise from "hooks/use-state-promise";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
// import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import { convertFristCharcapital } from "helper/getMonthToNumber";
import {dateFormatWithTime} from 'helper/dateFormat';


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

const title = "Product Whole Purchase";
const subject = "product_whole_purchase";
const endpoint = {
  list: "product_whole_purchase_list_pagination_with_search",
  create: "product_whole_purchase_create",
  edit: "product_whole_purchase_edit",
  delete: "product_whole_purchase_delete",
};

const WarehouseStockIn = observer(() => {
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
  // const [search, setSearch] = useState("");
  const [invoiceData, setInvoicedata, setInvoicedataPromise] =
    useStatePromise(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);
  // const handleClickWarning = () => {
  //   setOpenWarning(true);
  // };


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

  const columns = [
    { title: "Invoice No",   render: (rowData) => convertFristCharcapital(rowData.invoice_no)},
    { title: "Supplier Name", field: "supplier_name" },
    { title: "User Name", field: "user_name" },
    { title: "Purchase Date Time", field: "purchase_date_time",render: (rowData) => dateFormatWithTime(rowData.purchase_date_time)},
    {
      title: "Total Taka",
      field: "total_amount",
    },
  ];


  const componentRef = React.useRef(null);
  const handlePrint = async (row) => {
    await axios
      .post(
        `${baseUrl}/product_whole_purchase_details`,
        {
          product_purchase_id: row.id,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      )
      .then((res) => {
        const state = setInvoicedataPromise(row).then(() => {
          console.log("running promise");
        });
        setInvoiceproduct(res.data.response);
      });
    if (handlePrintInvoice) {
      handlePrintInvoice();
    }
  };
 

  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });



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
                product_purchase_id: row_id,
            },
            endpoint.headers
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
  
      

  return (
    <Gurd subject={subject}>
      {/* <div style={{ display: "none" }}>
        <WholePurchaseInvoicePrint
          ref={componentRef}
          inv={invoiceData}
          invoiceProduct={invoiceProduct}
        />
      </div> */}
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
                    // onClick={handleCreate}
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

                data={query =>
                  new Promise((resolve, reject) => {
                   
                    let url = `${baseUrl}/${endpoint.list}?`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`
                    }
                  
                    url += `&page=${query.page + 1}`
                    fetch(url,{
                          method: "post",
                          headers: { Authorization: "Bearer " + user.auth_token },
                        }
                      ).then(resp => resp.json()).then(resp => {
            
                      resolve({
                            data: resp.data,
                            page: resp?.meta?.current_page - 1,
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
                    // onClick: (event, rowData) => handlePrint(rowData),
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

        </GridItem>
      </GridContainer>

    </Gurd>
  );
});

export default WarehouseStockIn;
