import React from "react";
import { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAsyncEffect } from "use-async-effect";
import tableIcons from "components/table_icon/icon";
// core components
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Chip, Grid, TextField, Divider } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
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
import TrialBalancePrint from '../../components/admin/trial_balance/trial_balance_print'


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

const title = "Ledger";
const subject = "ledger";
const endpoint = {
  list: "trial_balance_report",
};
const TrialBalance = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();

  const [warehouseList, setWarehouseList] = React.useState([]);
  const [storeList, setStoreList] = React.useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [selectedStore, setSelecteStore] = React.useState(null);
  const [wareOrStore, setWareOrStore] = React.useState("None");
  const [responseData, setResponseData] = useState(null);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [trialData, setTrialData] = useState(null);
  
  
  const title = "Ledger";
  const subject = "ledger";
  const endpoint = {
    warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
    storeActiveListUrl: `${baseUrl}/store_active_list`,
    list: "trial_balance_report",
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

      setWarehouseList(warehouseRes?.data?.data);
      setStoreList(storeRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  
  
  
  const fetchLedger = async () => {
    try {
      const result = await axios.post(
        `${baseUrl}/${endpoint.list}`,
        {
          from_date: from,
          to_date: to,
          store_id: selectedStore,
          warehouse_id: selectedWarehouse,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      );
      setTrialData(result.data.response);

    } catch (error) {
      console.log(error);
    }
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

  
  return (
    <div>
       <div style={{ display: 'none' }}>
        <TrialBalancePrint
          ref={componentRef}
          trialData={trialData}
          from={from}
          to={to}
        />
      </div> 
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <Grid container spacing={1}>
        <Grid item xs={1}>
          </Grid>
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
                <Box mt={1}>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    // alignItems="center"
                  >
                    <Typography variant="h5" align="center">
                      Trial Balance
                    </Typography>
                    <Typography  align="right" style={{cursor:"pointer"}}>
               
                        <PrintTwoToneIcon onClick={handlePrint} color="white" />
                   
                    </Typography>

                  </Grid>
                </Box>

                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead style={{ backgroundColor: "green" }}>
                      <TableRow>
                        <TableCell>SL</TableCell>
                        <TableCell>Lager Name</TableCell>
                        <TableCell>Debit</TableCell>
                        <TableCell>Credit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trialData &&
                        trialData?.ResultTr?.map((item, index) => (
                          <TableRow>
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {item.head_name}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {item.debit == "0.00" ? "" : item.debit}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {item.credit == "0.00" ? "" : item.credit}
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow style={{ backgroundColor: "yellow" }}>
                        <TableCell component="th" scope="row">
                          Total
                        </TableCell>

                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell component="th" scope="row">
                          {trialData?.TotalDebit}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {trialData?.TotalCredit}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/*          
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePrint(ledger)}>
                    Print
                  </Button> */}
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
});

export default TrialBalance;
