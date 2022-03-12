import React, { useEffect } from "react";
import cogoToast from "cogo-toast";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Button, Grid, MenuItem } from "@material-ui/core";
import { useRootStore } from "models/root-store-provider";
import { baseUrl } from "const/api";
import GridItem from "components/Grid/GridItem";

const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
  multilineColor: {
    color: "black",
    fontWeight: "bold",
    fontSize: 17,
  },
});

const ClaculationComponent = ({
  products,
  subTotal,
  setSubTotal,
  grand,
  setGrand,
  discountAmount,
  setDiscountAmount,
  discountType,
  setDiscountType,
  discountParcent,
  setDiscountParcent,
  afterDiscountAmount,
  setAfterDiscountAmount,
  paymentType,
  setPaymentType,
  paid,
  setPaid,
  due,
  setDue,
  lessAmount,
  setLessAmount,
  afterLessAmount,
  setAfterLessAmount,
  checkIssueDate,
  setCheckIssueDate,


}) => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [paymentTypeList, setPaymentTypeList] = React.useState([]);

  const endpoint = {
    paymentTypeActiveListAPI: `${baseUrl}/payment_type_active_list`,
    headers: {
      headers: {
        Authorization: "Bearer " + user.details.token,
        "Content-type": "application/javascript",
      },
    },
  };

  // load warehouse and supplier
  useAsyncEffect(async (isMounted) => {
    try {
      const paymentTypeRes = await axios.get(
        endpoint.paymentTypeActiveListAPI,
        endpoint.headers
      );
      setPaymentTypeList(paymentTypeRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  let disPointValue = null;

  if (discountType == "Flat") {
    disPointValue = discountAmount;
  } else {
    disPointValue = discountParcent;
  }

  const [discountPoint, setDiscountPoint] = React.useState(disPointValue);

  let tempAMount = 0;

  useEffect(() => {

    products.map(
      (prd) =>
        (tempAMount = tempAMount + parseFloat(prd.purchase_price) * prd.qty)
    );

    // set subtotal
    setSubTotal(tempAMount);
    // discount
    const afterDisCal = tempAMount - parseFloat(discountAmount);
    setAfterDiscountAmount(afterDisCal);
    //less
    const aftrlesCal = afterDisCal - parseFloat(lessAmount);
    setAfterLessAmount(aftrlesCal)
    setGrand(aftrlesCal);
    //set paid
    const p = paid || 0;
    setDue(aftrlesCal - p);

    // setDiscountPointHandle(discountPoint);
  }, [
    products,
    subTotal,
    afterDiscountAmount,
    discountAmount,
    lessAmount,
    setPaid,
    setLessAmount,
    setDiscountAmount,
  ]);

  // useEffect(()=>{
  //   setDue(subTotal-paid)
  // },[setPaid,setDue])

  const setDiscountPointHandle = (dPoint) => {
    if (dPoint && dPoint >= 0) {
      setDiscountPoint(dPoint);
      if (discountType == "Flat") {
        setDiscountAmount(parseFloat(dPoint));
      }
      if (discountType == "Percentage") {
        const calDiscount = (dPoint * subTotal) / 100;
        setDiscountAmount(calDiscount);
        setDiscountParcent(dPoint);
      }
    } else {
      setDiscountAmount(0);
      setDiscountPoint();
    }
  };

  const discountTypeHandle = (dType) => {
    setDiscountType(dType);
    if (discountPoint && discountPoint >= 0) {
      if (dType == "Flat") {
        setDiscountAmount(parseFloat(discountPoint));
      }
      if (dType == "Percentage") {
        const calDiscount = (discountPoint * subTotal) / 100;
        setDiscountAmount(calDiscount);
        setDiscountParcent(discountPoint);
      }
    }
  };

  // return cogoToast.warn('Please select Warehouse/Store',{position: 'top-right', bar:{size: '10px'}});
  const handlePaidDue = (paidAmount) => {
    if (paidAmount < 0) {
      setPaid(afterLessAmount);
      return cogoToast.warn("Please provide valid amount", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    setPaid(paidAmount);
    setDue(afterLessAmount - paidAmount);
  };

  //less handle
  const lessHandle = (lessamount) => {
    if (lessamount < 0 || lessamount > subTotal) {
      setPaid(subTotal);
      return cogoToast.warn("Please provide valid amount", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }
    setLessAmount(lessamount);
    setAfterLessAmount(afterDiscountAmount - lessamount);
    // setPaid(paidAmount);
    // setDue(subTotal - paidAmount);
  };

  const clearHandle = () => {
    console.log("jjj");
    setPaid(0);
    setDue(0)
    setLessAmount(0);
    setDiscountPoint(0);
    setDiscountAmount(0);
    setAfterLessAmount(0);
  };


  return (
    <div>
      <Grid container alignItems="flex-end" spacing={2} direction="row">
        <Grid item xs={2}>
          <TextField
            fullWidth={true}
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="Sub Total"
            disabled
            value={parseFloat(subTotal)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            disabled
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="Discount"
            name="discoumt"
            value={parseFloat(discountAmount)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            disabled
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="After Discount"
            name="discoumt"
            value={parseFloat(afterDiscountAmount)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            disabled
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="After Less"
            name="discoumt"
            value={parseFloat(afterLessAmount)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            disabled
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="Due"
            value={parseFloat(due)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            disabled
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="Grand Total"
            name="grand_total"
            value={parseFloat(grand)}
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
            type="text"
            select
            name="discount_type"
            label="Discount Type"
            value={discountType}
            helperText="Please select discount type"
            onChange={(e) => discountTypeHandle(e.target.value)}
          >
            <MenuItem value="Flat">Flat</MenuItem>
            <MenuItem value="Percentage">Percentage</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={2}>
          <TextField
            // component={TextField}
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="Discount"
            name="dispoint"
            type="tel"
            helperText="Please set discount value"
            value={discountPoint}
            onChange={(e) => setDiscountPointHandle(e.target.value)}
            InputProps={{
              className: classes.multilineColor,
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            // component={TextField}
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="Less Amount"
            name="dispoint"
            type="tel"
            helperText="Please set less amount"
            value={lessAmount}
            onChange={(e) => lessHandle(e.target.value)}
            InputProps={{
              className: classes.multilineColor,
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            margin="normal"
            variant="outlined"
            size="small"
            type="text"
            select
            name="discount_type"
            label="Payment Type"
            value={paymentType}
            helperText="Please select payment type"
            onChange={(e) =>
              {
                setCheckIssueDate('')
                setPaymentType(e.target.value)

              } }
          >
            {paymentTypeList.map((item) => (
              <MenuItem value={item.id}>{item?.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
     
      {  paymentType == '2' && (
        <Grid item xs={2}>
          <TextField
            // component={TextField}
            margin="normal"
            variant="outlined"
            size="small"
            type="date"
            // label="paid Amount"
            name="dispoint"
            helperText="Please set paid amount"
            value={checkIssueDate}
            helperText="Issue Date"
            InputProps={{
              className: classes.multilineColor,
            }}
          />
        </Grid>)

          }




        <Grid item xs={2}>
          <TextField
            // component={TextField}
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="paid Amount"
            name="dispoint"
            type="tel"
            helperText="Check Issue Date"
            value={paid}
            onChange={(e) => handlePaidDue(e.target.value)}
            InputProps={{
              className: classes.multilineColor,
            }}
          />
        </Grid>

        

        <Grid item xs={2} style={{marginTop:"50px"}}>
          <Button
            style={{ marginTop: "-86px", width: "100%", height: "40px" }}
            variant="contained"
            margin="normal"
            size="small"
            helperText="Please set paid amount"
            onClick={() => clearHandle()}
          >
            Clear
          </Button>
        </Grid>


        
      </Grid>
    </div>
  );
};
export default ClaculationComponent;
