import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Grid, MenuItem } from "@material-ui/core";

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
}) => {
  const classes = useStyles();

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
    setSubTotal(tempAMount);
    const afterDisCal = tempAMount - parseFloat(discountAmount);

    setGrand(afterDisCal);
    setAfterDiscountAmount(afterDisCal);
    setDiscountPointHandle(discountPoint);
  }, [products, subTotal, afterDiscountAmount, discountAmount]);

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

  return (
    <div>
      <Grid container spacing={1} direction="row">
        <Grid item xs={2}>
          <TextField
            margin="normal"
            variant="outlined"
            size="small"
            type="number"
            label="Sub Total"
            value={parseFloat(subTotal)}
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
            label="Payment Type"
            value={paymentType}
            helperText="Please select discount type"
            onChange={(e) => setPaymentType(e.target.value)}
          >
             <MenuItem value="1">Cash</MenuItem>
            <MenuItem value="2">Credit</MenuItem>
          </TextField>
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
            // onWheel={(e)=>
            //     {e.currentTarget.blur()
            //         setDiscountPointHandle(e.target.value)}

            //     }
            value={discountPoint}
            onChange={(e) => setDiscountPointHandle(e.target.value)}
            InputProps={{
              className: classes.multilineColor,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};
export default ClaculationComponent;
