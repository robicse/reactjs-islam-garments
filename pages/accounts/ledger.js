import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAsyncEffect } from "use-async-effect";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "components/guard/Gurd";
// import { useAsyncEffect } from 'use-async-effect';
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box, Chip, Grid, TextField, Divider } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import MenuItem from "@material-ui/core/MenuItem";
import { useReactToPrint } from "react-to-print";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
// import LagerList from 'components/admin/ledger/lagerPrint';
import useStatePromise from "hooks/use-state-promise";
import { dateFormatOnlyDate } from "helper/dateFormat";

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

let db = 0;
let cr = 0;
const LagerCom = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();

  const [warehouseList, setWarehouseList] = React.useState([]);
  const [storeList, setStoreList] = React.useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [selectedStore, setSelecteStore] = React.useState(null);
  const [wareOrStore, setWareOrStore] = React.useState("None");
  const [ledgerHeadList, setLegerHeadList] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [type, setType] = useState("Cash");

  const [preBalance, setPreBalance] = useState(0);
  const [preDebCre, setPreDebCre] = useState("De");

  const [resType, setResType] = useState(null);


  const [totalBalancedebitAndCredit, setTotalBalancedebitAndCredit] =
    useState(0);
  const [invoiceData, setInvoicedata, setInvoicedataPromise] =
    useStatePromise(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);

  const endpoint = {
    warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
    storeActiveListUrl: `${baseUrl}/store_active_list`,
    legerActiveListUrl: `${baseUrl}/chart_of_account_is_general_ledger_list`,
    legerListUrl: `${baseUrl}/ledger`,
    headers: { headers: { Authorization: "Bearer " + user.auth_token } },
  };

  //loading when component run
  useAsyncEffect(async (isMounted) => {
    try {
      const warehouseRes = await axios.get(
        endpoint.warehouseActiveListUrl,
        endpoint.headers
      );

      const storeRes = await axios.get(
        endpoint.storeActiveListUrl,
        endpoint.headers
      );
      const legerHeadRes = await axios.get(
        endpoint.legerActiveListUrl,
        endpoint.headers
      );

      setWarehouseList(warehouseRes?.data?.data);
      setStoreList(storeRes?.data?.data);
      setLegerHeadList(legerHeadRes?.data.response.chart_of_accounts);
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(responseData?.chart_of_account_transaction)

  const lastItem = responseData && responseData?.chart_of_account_transaction[responseData?.chart_of_account_transaction.length - 1]
  console.log(lastItem);


  const fetchLedger = () => {
    axios
      .post(
        endpoint.legerListUrl,
        {
          from_date: from,
          to_date: to,
          chart_of_account_name: type,
          store_id: selectedStore,
          warehouse_id: selectedWarehouse,
        },
        endpoint.headers
      )
      .then((res) => {

        setResType(res.data.response?.head_debit_or_credit)
        setPreBalance(res.data.response.PreBalance);
        setPreDebCre(res.data.response.preDebCre);

        let PreBalance = res.data.response.PreBalance;
        let PreDebCre = res.data.response.preDebCre;

        res.data.response.chart_of_account_transaction.map((d) => {
          let currentDeCr = "";
          let currentBalance = 0;
          if (d.debit != null) {
            currentDeCr = "De";
            currentBalance = d.debit;
          } else {
            currentDeCr = "Cr";
            currentBalance = d.credit;
          }

          if (PreDebCre == currentDeCr) {
            if (currentDeCr == "De") {
              PreBalance = PreBalance + d.debit;
              PreDebCre = currentDeCr;
            } else {
              PreBalance = PreBalance + d.credit;
              PreDebCre = currentDeCr;
            }
          } else {
            if (currentBalance > PreBalance) {
              PreBalance = currentBalance - PreBalance;
              PreDebCre = currentDeCr;
            } else {
              PreBalance = PreBalance - currentBalance;
              PreDebCre = PreDebCre;
            }
          }

          d.balance = PreBalance;
          d.deCr = PreDebCre;
          db = db + d.debit;
          cr = cr + d.credit;
        });

        // console.log(res.data.response);
        setResponseData(res.data.response);

        const totalAmount =
          res.data.response.chart_of_account_transaction.reduce(
            (a, item) => {
              return {
                credit: item.credit + a.credit,
                debit: item.debit + a.debit,
              };
            },
            {
              credit: 0,
              debit: 0,
            }
          );

        const totalbalancedebitAndCredit = {
          totalDebit: totalAmount.debit + res.data.response.pre_debit,
          totalCredit: totalAmount.credit + res.data.response.pre_credit,
        };
        console.log(res.data.response.pre_credit);
        setTotalBalancedebitAndCredit(totalbalancedebitAndCredit);
      })
      .catch((error) => {
        console.log(error);
        // setLedger(null);
      });
  };

  const componentRef = React.useRef(null);
  const handlePrint = async (row) => {
    await axios
      .get(`${baseUrl}/warehouse_list`, {
        headers: { Authorization: "Bearer " + user.auth_token },
      })
      .then((res) => {
        const state = setInvoicedataPromise(row).then(() => {
          console.log("running promise");
        });
        setInvoiceproduct(row);
      });
    if (handlePrintInvoice) {
      handlePrintInvoice();
    }
  };
  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Gurd subject="Ledger">
      {/* <div style={{ display: 'none' }}>
        <LagerList
          ref={componentRef}
          ledger={invoiceData}
          totalBalancedebitAndCredit={totalBalancedebitAndCredit}
          debittotal={debittotal}
          credittotal={credittotal}
          preDebCre={preDebCre}
          preBalance={preBalance}
          closingBalance={closingBalance}
          from={from}
          to={to}
          type={type}
        />
      </div> */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Box>
                <TextField
                  size="small"
                  id="standard-helperText"
                  type="date"
                  fullWidth={true}
                  variant="outlined"
                  helperText="Form"
                  onChange={(e) => setFrom(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box>
                <TextField
                  size="small"
                  id="standard-helperText"
                  type="date"
                  fullWidth={true}
                  variant="outlined"
                  helperText="To"
                  onChange={(e) => setTo(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <TextField
                size="small"
                id="standard-select-currency"
                select
                label="Ledger Head                "
                fullWidth={true}
                variant="outlined"
                // disabled={true}
                value={type}
                // onChange={handleChange}
                onChange={(e) => setType(e.target.value)}
                // helperText="Please select general ledger head                "
              >
                {ledgerHeadList &&
                  ledgerHeadList.map((gl) => (
                    <MenuItem value={gl.head_name}>{gl.head_name}</MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={2}>
              <FormControl
                component="fieldset"
                size="small"
                style={{ marginLeft: "8px", marginTop: "-14px" }}
              >
                {/* <FormLabel component="legend">Gender</FormLabel> */}
                <RadioGroup
                  aria-label="gender"
                  size="small"
                  name="gender1"
                  value={wareOrStore}
                  onChange={(e) =>{
                    setWareOrStore(e.target.value)
                    setSelecteStore(null)
                    setSelectedWarehouse(null)
                  } }
                >
                   <FormControlLabel
                    size="small"
                    value="None"
                    control={<Radio size="small" />}
                    label="ALL"
                  />
                  <FormControlLabel
                    size="small"
                    value="Warehouse"
                    control={<Radio size="small" />}
                    label="Warehouse"
                  />
                  <FormControlLabel
                    size="small"
                    value="Store"
                    control={<Radio size="small" />}
                    label="Store"
                  />
                 
                </RadioGroup>
              </FormControl>
            </Grid>

            <GridItem xs={12} sm={12} md={2}>
              {wareOrStore == "Warehouse" && (
                <Autocomplete
                  size="small"
                  fullWidth={true}
                  // value={selectedWarehouse}
                  id="combo-box-demo"
                  options={warehouseList}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Warehouse"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => {
                    setSelecteStore(null);
                    setSelectedWarehouse(v.id);
                  }}
                />
              )}
              {wareOrStore == "Store" && (
                <Autocomplete
                  size="small"
                  fullWidth={true}
                  // value={selectedWarehouse}
                  id="combo-box-demo"
                  options={storeList}
                  getOptionLabel={(option) => option.store_name}
                  renderInput={(params) => (
                    <TextField {...params} label="Store" variant="outlined" />
                  )}
                  onChange={(e, v) => {
                    setSelecteStore(v.id);
                    setSelectedWarehouse(null);
                  }}
                />
              )}
            </GridItem>

            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={fetchLedger}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          <Card>
            <CardBody>
              <Grid container direction="column" style={{ padding: 20 }}>
                <Box mt={2}>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                  >
                    {/* <img
                      src="/logo.png"
                      alt=""
                    /> */}
                    <Typography variant="h5" align="center">
                      General Ledger
                    </Typography>
                  </Grid>
                </Box>

                <TableContainer>
                  <Table aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>

                        <TableCell>Debit</TableCell>
                        <TableCell>Credit</TableCell>
                        <TableCell>Balance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        style={{ backgroundColor: "gray", color: "white" }}
                      >
                        <TableCell component="th" scope="row">
                          N/A
                        </TableCell>
                        <TableCell component="th" scope="row">
                          Opening Balance
                        </TableCell>
                        <TableCell component="th" scope="row">
                          N/A
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {preDebCre == "De" && preBalance + " De"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {preDebCre == "Cr" && preBalance + " Cr"}
                        </TableCell>

                        <TableCell component="th" scope="row"></TableCell>
                      </TableRow>

                      {responseData && (
                        <>
                          {responseData.chart_of_account_transaction.map(
                            (item) => (
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {item.transaction_date_time}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {item.description}
                                </TableCell>

                                <TableCell component="th" scope="row">
                                  {item.debit}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {item.credit}
                                </TableCell>

                                <TableCell component="th" scope="row">
                                  {item.balance}
                                </TableCell>
                              </TableRow>
                            )
                          )}

                          {/* <TableRow>
                            <TableCell component="th" scope="row"></TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ fontWeight: "bold" }}
                            >
                              Current Total
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {totalBalancedebitAndCredit?.totalDebit}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {totalBalancedebitAndCredit?.totalCredit}
                            </TableCell>
                            <TableCell component="th" scope="row"></TableCell>
                          </TableRow> */}
                        </>
                      )}
                      <Divider />
                      <TableRow>
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell component="th" scope="row">
                          Closing Balance :
                        </TableCell>
                        <TableCell component="th" scope="row">
                       {lastItem?.balance} {resType}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 

                {ledger && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePrint(ledger)}>
                    Print
                  </Button>
                )} */}


                
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </Gurd>
  );
});

export default LagerCom;
