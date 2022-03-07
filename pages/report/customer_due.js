import React from "react";
import { useState, useEffect } from "react";
// @material-ui/core components
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAsyncEffect } from "use-async-effect";
import { makeStyles } from "@material-ui/core/styles";
import tableIcons from "components/table_icon/icon";
// core components
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box, Chip, Grid, TextField, Divider } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import MuiAlert from "@material-ui/lab/Alert";




import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';



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

const CustomerSue = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();

  const [customerList, setCustomerList] = React.useState([]);
  const [paymentTypeList, setPaymentTypeList] = React.useState([]);
  const [currentDue, setCurrentDue] = useState(0);
  const [due, setDue] = useState(0);
  const [paid, setPaid] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [load, setLoad] = useState(false);
  const endpoint = {
    wholeSaleCustomerActiveListUrl: `${baseUrl}/whole_sale_customer_active_list`,
    headers: { headers: { Authorization: "Bearer " + user.details.token } },
    customerDueApi: `${baseUrl}/customer_current_total_due_by_customer_id`,
    customerDuePaidApi: `${baseUrl}/customer_due_paid`,
    paymentTypeActiveListUrl: `${baseUrl}/payment_type_active_list`,
  };

  //loading when component run
  useAsyncEffect(async (isMounted) => {
    try {
      const customerRes = await axios.get(
        endpoint.wholeSaleCustomerActiveListUrl,
        endpoint.headers
      );

      const paymentTypeRes = await axios.get(
        endpoint.paymentTypeActiveListUrl,
        endpoint.headers
      );

      setCustomerList(customerRes?.data?.data);
      setPaymentTypeList(paymentTypeRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchReportData = async (id) => {
    try {
      setLoad(false)
      setCurrentDue(0);
      setPaid(0);
      setDue(0);
      const result = await axios.post(
        endpoint.customerDueApi,
        {
          customer_id: id,
        },
        endpoint.headers
      );
      console.log(result.data.data);
      setCurrentDue(result.data.data);
      setDue(result.data.data);
      setLoad(true)
    } catch (error) {
      console.log(error);
    }
  };

  // return cogoToast.warn('Please select Warehouse/Store',{position: 'top-right', bar:{size: '10px'}});
  const handlePaidDue = (paidAmount) => {
    if (paidAmount < 0 || paidAmount > currentDue) {
      return cogoToast.warn("Please provide valid amount", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    setPaid(paidAmount);
    setDue(currentDue - paidAmount);
  };


  const handlePaymentSubmit = async (id) => {

    if (paid < 0 || paid > currentDue) {
        return cogoToast.warn("Please provide valid amount", {
          position: "top-right",
          bar: { size: "10px" },
        });
      }

    try {
 
      const result = await axios.post(
        endpoint.customerDuePaidApi,
        {
          customer_id: id,
          paid_amount: paid,
          due_amount: due,
          payment_type_id: paymentType,
        },
        endpoint.headers
      );
      fetchReportData(id)
    } catch (error) {
      console.log(error);
    }
  };





  const [paymentType, setPaymentType] = React.useState(1);
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };










  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Grid container spacing={1}>
            <Grid item xs={3}></Grid>

            <Grid item xs={3}>
              <Box>
                <Autocomplete
                  size="small"
                  fullWidth={true}
                  // value={selectedWarehouse}
                  id="combo-box-demo"
                  options={customerList}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => setSelectedCustomer(v?.id)}
                />
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Button
                size="small"
                style={{ height: "39px" }}
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={()=>fetchReportData(selectedCustomer)}
              >
                Submit
              </Button>
            </Grid>

        
          </Grid>
          <Card>
            <CardBody>
              <Grid container direction="column" style={{ padding: 20 }}>
                <Box mt={1}>


                    {!load && <Typography variant="h5" align="center">
                     No Result
                    </Typography>

                    }
                {load  && <Grid container spacing={1} direction="row">
                 
                <Grid item xs={2}>
                    </Grid>
                  

                    <Grid item xs={2}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        size="small"
                        type="number"
                        label="Prevoius Due"
                        value={parseFloat(currentDue)}
                        InputProps={{
                          className: classes.multilineColor,
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        size="small"
                        type="number"
                        label="Paid Amount"
                        value={parseFloat(paid)}
                        InputProps={{
                          className: classes.multilineColor,
                          readOnly: false,
                        }}
                        onChange={(e) => handlePaidDue(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={2} >
                        <FormControl className={classes.formControl}>
                          <InputLabel id="demo-controlled-open-select-label">Payment</InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={paymentType}
                            onChange={handleChange}
                          >
                            <MenuItem value={1}>Cash</MenuItem>
                            <MenuItem value={2}>Cheque</MenuItem>
                          </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2} >
                      <TextField
                        margin="normal"
                        variant="outlined"
                        size="small"
                        type="number"
                        label="Current Due"
                        value={parseFloat(due)}
                        InputProps={{
                          className: classes.multilineColor,
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={2} >
                      <Button
                        size="small"
                        style={{ height: "39px",marginTop:"16px"}}
                        variant="contained"
                        color="primary"
                        disabled={currentDue == 0 ? true: false}
                        // fullWidth={true}
                        onClick={()=>handlePaymentSubmit(selectedCustomer)}
                      >
                        Pay Now
                      </Button>
                    </Grid>
                  </Grid>
}
                </Box>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
});

export default CustomerSue;
