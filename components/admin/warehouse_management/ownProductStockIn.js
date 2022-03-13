import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import TextField from "@material-ui/core/TextField";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Autocomplete from "@material-ui/lab/Autocomplete";
import cogoToast from "cogo-toast";
import Grid from "@material-ui/core/Grid";
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Typography,
  Select,
} from "@material-ui/core";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import AllApplicationErrorNotification from "../../utils/errorNotification";
import Productstable from "../common_component/Productstable";
import ProductSelectByDropdown from "../common_component/productSelectByDropdown";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  cardBack: {
    color: "#FFFFFF",
    backgroundColor: "blue",
  },
  submit: {
    marginTop: "15px",
  },
};
const useStyles = makeStyles(styles);
const OwnProductStockIn = ({ endpoint, modal, handleRefress }) => {
  const classes = useStyles();

  // calculation statte
  const [subTotal, setSubTotal] = React.useState(0);
  const [warehouseList, setWarehouseList] = React.useState([]);

  // input data state
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(
    endpoint?.loginWarehouse?.id
  );
  //   const [selectedSupplyer, setSelectedSupplyer] = React.useState(null);
  const [submitButtonLoading, setButtonLoading] = React.useState(false);

  // selected prodict state
  const [selectedProductList, setSelectedProduct] = React.useState([]);

  // load warehouse and supplier
  useAsyncEffect(async (isMounted) => {
    try {
      const warehouseRes = await axios.get(
        endpoint.warehouseActiveListUrl,
        endpoint.headers
      );

      setWarehouseList(warehouseRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, []);


   // subtotal calculation
   React.useEffect(() => {
    let tempAMount = 0;
    selectedProductList && selectedProductList.map(
      (prd) =>
        (tempAMount = tempAMount + parseFloat(prd.purchase_price) * prd.qty)
    );
    setSubTotal(tempAMount);
  }, [selectedProductList]);



  // handle product add
  const handleProductAdd = (prod) => {
    if (!selectedProductList.length) {
      cogoToast.info("Product Added", {
        position: "top-right",
        bar: { size: "10px" },
      });
      return setSelectedProduct([prod]);
    }
    selectedProductList.filter((item) => {
      if (item.id == prod.id) {
        cogoToast.info("Product Alreday Exits", {
          position: "top-right",
          bar: { size: "10px" },
        });
      } else {
        setSelectedProduct([...selectedProductList, prod]);
        cogoToast.info("Product Added", {
          position: "top-right",
          bar: { size: "10px" },
        });
      }
    });
  };

  // handle product remove
  const handdleproductRemove = (proId) => {
    console.log("remove done");
    const filterList = selectedProductList.filter((item) => item.id !== proId);
    setSelectedProduct(filterList);
    cogoToast.success("Removed", {
      position: "top-right",
      bar: { size: "10px" },
    });
  };

  // handle quantity change
  const handdleQuantityChange = (prodId, current_stock, qty) => {
    if (qty < 0) {
      return cogoToast.error("Enter Valid QTY", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }
    setSelectedProduct(
      selectedProductList.map((item) =>
        item.id === prodId ? { ...item, qty: qty } : item
      )
    );
  };

  // handle sitock in create
  const handleFinalStockInCreate = async () => {
    if (!selectedDate) {
      return cogoToast.warn("Please Select Date", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    const body = {
      date: selectedDate,
      warehouse_id: selectedWarehouse,
      products: JSON.stringify(selectedProductList),
      discount_type: "",
      discount_percent: 0,
      discount_amount: 0,
      after_discount_amount: 0,
      sub_total_amount: subTotal,
      grand_total_amount: subTotal,
      paid_amount: subTotal,
      due_amount: 0,
      payment_type_id: "",
    };
    console.log(body);

    // convert formdata
    const data = new FormData();
    Object.keys(body).forEach((key) => data.append(key, body[key]));

    try {
      setButtonLoading(true);
      cogoToast.success("Submit Success", {
        position: "top-right",
        bar: { size: "10px" },
      });
      const submitResponse = await axios.post(
        endpoint.stockInAPi,
        data,
        endpoint.FrpmDataheaders
      );
      handleRefress();
      setButtonLoading(false);
      modal(false);
      // handleRefress();
    } catch (error) {
      AllApplicationErrorNotification(error);
      setButtonLoading(false);
    }
  };

  console.log(selectedDate)

  return (
    <div>
      <GridContainer style={{ padding: "15px", marginTop: 250 }}>
        <GridItem xs={12} sm={3} md={6}>
          <TextField
            size="small"
            id="standard-basic"
            variant="outlined"
            type="date"
            // value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: "100%" }}
          />
        </GridItem>

        <GridItem xs={12} sm={3} md={6}>
          {endpoint?.loginWarehouse?.role == "Super Admin" && (
            <Autocomplete
              size="small"
              // disabled={endpoint?.loginWarehouse?.role !== 'Super Admin'}
              fullWidth={true}
              // value={{name: endpoint?.loginWarehouse?.name}}
              id="combo-box-demo"
              options={warehouseList}
              getOptionLabel={(option) => option?.name}
              renderInput={(params) => (
                <TextField {...params} label="Warehouse" variant="outlined" />
              )}
              onChange={(e, v) => setSelectedWarehouse(v.id)}
            />
          )}

          {endpoint?.loginWarehouse?.role !== "Super Admin" && (
            <TextField
              disabled={true}
              size="small"
              id="standard-basic"
              variant="outlined"
              type="text"
              value={endpoint?.loginWarehouse?.name}
              style={{ width: "100%" }}
            />
          )}
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <div style={{ marginTop: "15px" }}>
            <ProductSelectByDropdown
              idRequired={false}
              endpoint={endpoint}
              handleProductAdd={handleProductAdd}
              productType="Own"
            />
          </div>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h6" style={{ padding: "10px" }}>
            {" "}
            product List
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          {selectedProductList.length > 0 && (
            <Productstable
              products={selectedProductList}
              handdleproductRemove={handdleproductRemove}
              handdleQuantityChange={handdleQuantityChange}
              //   handdlePriceChange={handdlePriceChange}
            />
          )}
        </GridItem>

        {selectedProductList.length > 0 && (
           <GridItem
           xs={12}
           sm={12}
           md={12}
           style={{ textAlign: "right", marginTop: "10px" }}>
  
            <TextField
            
            // style={{backgroundColor:"red",alignContent:"end"}}
              // style={{textAlign:"right"}}
              size="small"
              variant="filled"
              type="number"
              label="Sub Total"
              value={parseFloat(subTotal)}
              InputProps={{
                className: classes.multilineColor,
                readOnly: true,
              }}
            />
  
            </GridItem>
  
  

         )}

       


        <GridItem
          xs={12}
          sm={12}
          md={12}
          style={{ textAlign: "right", marginTop: "5px" }}
        >
          {selectedProductList.length > 0 && (
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={handleFinalStockInCreate}
            >
              {submitButtonLoading ? "loading" : "Submit"}
            </Button>
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default OwnProductStockIn;
