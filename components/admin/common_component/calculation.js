import React, { useEffect } from "react";
import cogoToast from "cogo-toast";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Grid, MenuItem } from "@material-ui/core";
import { useRootStore } from "models/root-store-provider";
import { baseUrl } from "const/api";

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
    setSubTotal(tempAMount);
    const afterDisCal = tempAMount - parseFloat(discountAmount);

    setGrand(afterDisCal);
    setAfterDiscountAmount(afterDisCal);
    setDue(subTotal-paid)
    
    // setDiscountPointHandle(discountPoint);
  }, [products, subTotal, afterDiscountAmount, discountAmount]);


  // useEffect(()=>{
  //   setDue(subTotal-paid)
  // },[setPaid,setDue])

  console.log(paymentTypeList)
console.log(paymentType)
const findPaymentTypeById=(id)=>{
 const getType = paymentTypeList.filter((item)=>item.id==id)
 return getType[0].name
}
  const paymentTypeHandle=(ty)=>{
    setPaid(0)
    setDue(0)
    setPaymentType(ty)
    const calget = findPaymentTypeById(ty)
    if(calget == 'Credit'){
      setDue(subTotal-paid)
      console.log(subTotal,paid,due)
      // console.log(subTotal,paid)
      //   setDue(10)
    }
    if(calget == 'Cash'){
      console.log(subTotal,paid,due)
      // setPaid(subTotal)
      // setDue(0)
      // setPaymentType(ty)
    }
 
  }
  // const setDiscountPointHandle = (dPoint) => {
  //   if (dPoint && dPoint >= 0) {
  //     setDiscountPoint(dPoint);
  //     if (discountType == "Flat") {
  //       setDiscountAmount(parseFloat(dPoint));
  //     }
  //     if (discountType == "Percentage") {
  //       const calDiscount = (dPoint * subTotal) / 100;
  //       setDiscountAmount(calDiscount);
  //       setDiscountParcent(dPoint);
  //     }
  //   } else {
  //     setDiscountAmount(0);
  //     setDiscountPoint();
  //   }
  // };

  // const discountTypeHandle = (dType) => {
  //   setDiscountType(dType);
  //   if (discountPoint && discountPoint >= 0) {
  //     if (dType == "Flat") {
  //       setDiscountAmount(parseFloat(discountPoint));
  //     }
  //     if (dType == "Percentage") {
  //       const calDiscount = (discountPoint * subTotal) / 100;
  //       setDiscountAmount(calDiscount);
  //       setDiscountParcent(discountPoint);
  //     }
  //   }
  // };

  // return cogoToast.warn('Please select Warehouse/Store',{position: 'top-right', bar:{size: '10px'}});
  const handlePaidDue = (paidAmount) => {
    if (paidAmount < 0 || paidAmount > subTotal) {
      setPaid(subTotal)
      return cogoToast.warn("Please provide valid amount", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    setPaid(paidAmount);
    setDue(subTotal - paidAmount);
  };
  return (
    <div>
      <Grid container spacing={1} direction="row">
        <Grid item xs={8}></Grid>

        <Grid item xs={2}>
          <TextField
            margin="normal"
            variant="outlined"
            size="small"
            type="text"
            select
            // name="discount_type"
            label="Payment Type"
            value={paymentType}
            helperText="Please select payment type"
            onChange={(e) =>paymentTypeHandle(e.target.value)}
          >

            {
              paymentTypeList.map((item)=>(
                <MenuItem value={item.id}>{item?.name}</MenuItem>
              ))
            }
         
            {/* <MenuItem value="2">Credit</MenuItem> */}
          </TextField>
        </Grid>
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

        <Grid item xs={8}></Grid>
        <Grid item xs={2}>
          {paymentType == "2" && (
            <TextField
              margin="normal"
              variant="outlined"
              size="small"
              type="tel"
              label="Paid"
              // value={parseFloat(paid)}
              InputProps={{
                className: classes.multilineColor,
                readOnly: false,
              }}
              onChange={(e) => handlePaidDue(e.target.value)}
            />
          )}
        </Grid>
        <Grid item xs={2}>
          {paymentType == "2" && (
            <TextField
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
          )}
        </Grid>
      </Grid>

      {/* <Grid container spacing={1} direction="row">
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
      </Grid> */}
    </div>
  );
};
export default ClaculationComponent;
