import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import TextField from "@material-ui/core/TextField";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Autocomplete from "@material-ui/lab/Autocomplete";
import cogoToast from "cogo-toast";
import { Button, Typography } from "@material-ui/core";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import AllApplicationErrorNotification from "../../utils/errorNotification";
import Productsearch from "../common_component/productsearch";
import Productstable from "../common_component/Productstable";
// import Calculation from "../common_component/calculation";
import ProductSelectByDropdown from "../common_component/productSaleDropdown";

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
};
const useStyles = makeStyles(styles);
const StoreStockIn = ({ endpoint, modal, handleRefress }) => {
  const classes = useStyles();
  // console.log(endpoint?.loginStore);
  // calculation statte
  const [subTotal, setSubTotal] = React.useState(0);
  // const [paid, setPaid] = React.useState();
  // const [due, setDue] = React.useState(0);
  // const [discountAmount, setDiscountAmount] = React.useState(0);
  // const [grand, setGrand] = React.useState(0);
  // const [discountType, setDiscountType] = React.useState("Flat");
  // const [paymentType, setPaymentType] = React.useState(1);
  // const [discountParcent, setDiscountParcent] = React.useState(0);
  // const [afterDiscountAmount, setAfterDiscountAmount] = React.useState(0);

  //initial load state
  const [warehouseList, setWarehouseList] = React.useState([]);
  const [storeList, setStoreList] = React.useState([]);

  // input data state
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [selectedStore, setSelecteStore] = React.useState(endpoint?.loginStore?.id);
  const [submitButtonLoading, setButtonLoading] = React.useState(false);

  // selected prodict state
  const [selectedProductList, setSelectedProduct] = React.useState([]);

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
    console.log(prodId, current_stock, qty)
    if (qty < 0) {
      return cogoToast.error("Enter Valid QTY", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    // if (qty > current_stock) {
    //   return cogoToast.error("Stock Not Match", {
    //     position: "top-right",
    //     bar: { size: "10px" },
    //   });
    // }
    setSelectedProduct(
      selectedProductList.map((item) =>
        item.id === prodId ? { ...item, qty: qty } : item
      )
    );
  };

  // handle handdlePriceChange change
  const handdlePriceChange = (prodId, price) => {
    if (price < 0) {
      return cogoToast.error("Enter Valid price", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }
    setSelectedProduct(
      selectedProductList.map((item) =>
        item.id === prodId ? { ...item, purchase_price: price } : item
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

    if (!selectedWarehouse) {
      return cogoToast.warn("Please Select Warehouse", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    if (!selectedStore) {
      return cogoToast.warn("Please Select Store", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    if (subTotal < 0) {
      return cogoToast.warn("Please Input Valid Amount", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    const body = {
      date: selectedDate,
      // supplier_id: selectedSupplyer,
      warehouse_id: selectedWarehouse,
      store_id: selectedStore,
      products: JSON.stringify(selectedProductList),
      miscellaneous_comment: "",
      miscellaneous_charge: "",
      sub_total_amount: subTotal,
      discount_type: '',
      discount_percent: '',
      discount_amount: 0,
      after_discount_amount: 0,
      grand_total_amount: subTotal,
      paid_amount: subTotal,
      due_amount: 0,
    };

    // convert formdata
    const data = new FormData();
    Object.keys(body).forEach((key) => data.append(key, body[key]));

    try {
      setButtonLoading(true);
      cogoToast.success("Submit Success", {
        position: "top-right",
        bar: { size: "10px" },
      });
      await axios.post(
        endpoint.stockInAPi,
        data,
        endpoint.headers,
      );
      handleRefress();
      setButtonLoading(false);
      modal(false);

    } catch (error) {
      AllApplicationErrorNotification(error);
      setButtonLoading(false);
    }
  };

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={3} md={3}>
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

        <GridItem xs={12} sm={3} md={3}>
          <Autocomplete
            size="small"
            fullWidth={true}
            // value={selectedWarehouse}
            id="combo-box-demo"
            options={warehouseList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Warehouse" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedWarehouse(v.id)}
          />
        </GridItem>

        <GridItem
          xs={12}
          sm={3}
          md={2}
          style={{ textAlign: "center", marginTop: "10px" }}
        >
          <ArrowForwardIcon size="large" />
        </GridItem>

        <GridItem xs={12} sm={3} md={3}>
          {endpoint?.loginStore?.role == "Super Admin" && (
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
              onChange={(e, v) => setSelecteStore(v.id)}
            />
          )}

          {endpoint?.loginStore?.role !== "Super Admin" && (
            <TextField
              disabled={true}
              size="small"
              id="standard-basic"
              variant="outlined"
              type="text"
              value={endpoint?.loginStore?.name}
              style={{ width: "100%" }}
            />
          )}


        </GridItem>

        {/* <GridItem xs={12} sm={3} md={3}>
          <div style={{ marginTop: "-8px" }}>
            <Productsearch
              searchUrl={endpoint.productsearchForStockIn}
              headerds={endpoint.headers}
              handleProductAdd={handleProductAdd}
              searchBody={{ warehouse_id: selectedWarehouse }}
              warehouseIdRequired={true}
               idRequired={true}
            />
          </div>
        </GridItem> */}


        <GridItem xs={12} sm={12} md={12}>
          <div style={{ marginTop: "15px" }}>
            <ProductSelectByDropdown
              endpoint={endpoint}
              handleProductAdd={handleProductAdd}
              warehouseIdRequired={true}
              idRequired={true}
              searchBody={{ warehouse_id: selectedWarehouse }}
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
              handdlePriceChange={handdlePriceChange}
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
          xs={4}
          sm={4}
          md={12}
          style={{ textAlign: "right", marginTop: "5px" }}
        >
          {selectedProductList.length > 0 && (
            <Button
            //  style={{width:"100px"}}
              // fullWidth="true"
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

export default StoreStockIn;
