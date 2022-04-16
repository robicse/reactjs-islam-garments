import React from "react";
import { useState, useEffect } from "react";
// @material-ui/core components
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAsyncEffect } from "use-async-effect";
import tableIcons from "components/table_icon/icon";
// core components
import Typography from "@material-ui/core/Typography";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import Button from "@material-ui/core/Button";
import { Box, Chip, Grid, TextField, Divider } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import { useReactToPrint } from "react-to-print";
import PrintCustomerHistory from "components/admin/common_component/printCustomerHistory";

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

const SupplierReport = () => {
  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };
  const [supplierList, setSupplierList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [customerReportData, setCustomerReportData] = useState(null);
  const [totalcount, setTotalcount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const endpoint = {
    title: "Customer Report",
    customerReportListAPi: `${baseUrl}/product_whole_sale_list_search_by_customer`,
    customerActiveListApi: `${baseUrl}/whole_sale_customer_active_list`,
    headers: { headers: { Authorization: "Bearer " + user.auth_token } },
  };

  //loading when component run
  useAsyncEffect(async (isMounted) => {
    try {
      const supplierRes = await axios.get(
        endpoint.customerActiveListApi,
        endpoint.headers
      );

      setSupplierList(supplierRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSearch = async () => {
    handleRefress();
    // try {
    //   const result = await axios.post(
    //     `${baseUrl}/${endpoint.list}`,
    //     {
    //       from_date: from,
    //       to_date: to,
    //       store_id: selectedStore,
    //       warehouse_id: selectedWarehouse,
    //     },
    //     {
    //       headers: { Authorization: "Bearer " + user.auth_token },
    //     }
    //   );
    //   setTrialData(result.data.response);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const componentRef = React.useRef(null);

  const handlePrint = async () => {
    if (handlePrintInvoice) {
      handlePrintInvoice();
    }
  };
  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });
  const columns = [
    {
      title: "Invoice No",
      field: "invoice_no",
    },

    {
      title: "Date invoice No",
      field: "date_time",
    },

    { title: "Total(TK)", field: "grand_total_amount" },
    // { title: "payment Type", field: "payment_type" },
  ];

  return (
    <div>
      <div style={{ display: "none" }}>
      <PrintCustomerHistory
          ref={componentRef}
          customerReportData={customerReportData}
          from={from}
          to={to}
        />
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Grid container spacing={1}>
            <GridItem xs={12} sm={12} md={1}></GridItem>
            <Grid item xs={2}>
              <TextField
                size="small"
                id="standard-helperText"
                type="date"
                fullWidth={true}
                variant="outlined"
                helperText="Form"
                onChange={(e) => setFrom(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                size="small"
                id="standard-helperText"
                type="date"
                fullWidth={true}
                variant="outlined"
                helperText="To"
                onChange={(e) => setTo(e.target.value)}
              />
            </Grid>

            <GridItem xs={12} sm={12} md={2}>
              <Autocomplete
                style={{ marginTop: "5px" }}
                size="small"
                fullWidth={true}
                // value={selectedWarehouse}
                id="combo-box-demo"
                options={supplierList}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Customer" variant="outlined" />
                )}
                onChange={(e, v) => {
                  setSelectedSupplier(v?.id);
                }}
              />
            </GridItem>

            <Grid item xs={2}>
              <TextField
                size="small"
                id="standard-helperText"
                type="text"
                fullWidth={true}
                variant="outlined"
                helperText="Invoice Number"
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={handleSearch}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          <Card>
            <CardBody>
            <Box mt={1}>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  // alignItems="center"
                >
                  <Typography variant="h5" align="center">
                    Customer History
                  </Typography>
                  <Typography align="right" style={{ cursor: "pointer" }}>
                    <PrintTwoToneIcon onClick={handlePrint} color="white" />
                  </Typography>
                </Grid>
              </Box>
                <MaterialTable
                  icons={tableIcons}
                  title={`Total Amount ${totalcount}`}
                  tableRef={tableRef}
                  columns={columns}
                  data={(query) =>
                    new Promise((resolve, reject) => {
                      let url = `${endpoint.customerReportListAPi}?`;
                      let data = new FormData();
                      data.append(
                        "customer_id",
                        JSON.stringify(selectedSupplier)
                      );
                      data.append("from_date", from);
                      data.append("to_date", to);
                      data.append("search", invoiceNumber);

                      const requestOptions = {
                        method: "POST",
                        headers: {
                          Authorization: "Bearer " + user.auth_token,
                        },
                        body: data,
                      };

                      //searching
                      if (query.search) {
                        url += `search=${query.search}`;
                      }

                      url += `&page=${query.page + 1}`;

                      selectedSupplier &&
                        from &&
                        to &&
                        fetch(url, requestOptions)
                          .then((resp) => resp.json())
                          .then((resp) => {
                            if (resp.data) {
                              resolve({
                                data: resp?.data?.data,
                                page: resp?.data?.current_page - 1,
                                totalCount: resp?.data?.total,
                              });
                              console.log(resp?.data.current_page);
                              setCustomerReportData(resp?.data?.data);
                              setTotalcount(resp.total_amount);
                            } else {
                              resolve({
                                data: [],
                                page: 0,
                                totalCount: 0,
                              });
                              setTotalcount(0);
                            }
                          });
                    })
                  }
                  actions={
                    [
                      //   {
                      //     icon: RefreshIcon,
                      //     tooltip: "Refresh Data",
                      //     isFreeAction: true,
                      //     onClick: () => handleRefress(),
                      //   },
                    ]
                  }
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
    </div>
  );
};
export default SupplierReport;
