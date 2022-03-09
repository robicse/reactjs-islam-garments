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
import Productsearch from "../common_component/productsearch";
import Productstable from "../common_component/buyProductTable";
import Calculation from "../common_component/buyProductCalculation";
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
const Create = ({ endpoint, modal, handleRefress }) => {
  const classes = useStyles();
  // calculation statte
  const [subTotal, setSubTotal] = React.useState(0);
  const [paid, setPaid] = React.useState(0);
  const [due, setDue] = React.useState(0);
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [grand, setGrand] = React.useState(0);
  const [discountType, setDiscountType] = React.useState("Flat");
  const [paymentType, setPaymentType] = React.useState(1);
  const [discountParcent, setDiscountParcent] = React.useState(0);
  const [afterDiscountAmount, setAfterDiscountAmount] = React.useState(0);

  const [lessAmount, setLessAmount] = React.useState(0);
  const [afterLessAmount, setAfterLessAmount] = React.useState(0);

  
  //initial load state
  const [warehouseList, setWarehouseList] = React.useState([]);
  const [supplyerList, setSupplyerList] = React.useState([]);

  // input data state
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(
    endpoint?.loginWarehouse?.id
  );
  const [memoNumner, setMemoNumber] = React.useState('');
  const [selectedSupplyer, setSelectedSupplyer] = React.useState(null);
  const [submitButtonLoading, setButtonLoading] = React.useState(false);

  // selected prodict state
  const [selectedProductList, setSelectedProduct] = React.useState([]);
  // product Type


  // load warehouse and supplier
  useAsyncEffect(async (isMounted) => {
    try {
      const warehouseRes = await axios.get(
        endpoint.warehouseActiveListUrl,
        endpoint.headers
      );
      
      const supplyerRes = await axios.get(
        endpoint.supplyerActiveListUrl,
        endpoint.headers
      );

      setWarehouseList(warehouseRes?.data?.data);
      setSupplyerList(supplyerRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
 
    const filterList = selectedProductList.filter((item) => item.id !== proId);
    setSelectedProduct(filterList);
    cogoToast.success("Removed", {
      position: "top-right",
      bar: { size: "10px" },
    });
  };

  // handle quantity change
  const handdleQuantityChange = (prodId, qty) => {
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

  // handle handdlePriceChange change
  const handdletotalPriceChange = (prodId, price) => {

    if (price < 0) {
      return cogoToast.error("Enter Valid price", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }
    setSelectedProduct(
      selectedProductList.map((item) =>
        item.id === prodId ? { ...item, temptotalPrice: price } : item
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

    if (!selectedSupplyer) {
      return cogoToast.warn("Please Select Supplier", {
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
      supplier_id: selectedSupplyer,
      warehouse_id: selectedWarehouse,
      products: JSON.stringify(selectedProductList),
      discount_type: discountType,
      discount_percent: discountParcent,
      discount_amount: discountAmount,
      after_discount_amount: afterDiscountAmount,
      sub_total_amount: subTotal,
      grand_total_amount: grand,
      paid_amount: paid,
      due_amount: due,
      payment_type_id: paymentType,
      less_amount: lessAmount,
      after_less_amount: afterLessAmount,
      supplier_invoice_no: memoNumner
    };
    // console.log(body);

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

  return (
    <div>
      <GridContainer style={{ padding: "15px", marginTop: 250 }}>
        <GridItem xs={12} sm={3} md={2}>
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
            fullWidth={true}
            size="small"
            id="combo-box-demo"
            // value={selectedSupplyer}
            options={supplyerList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Supplyer" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedSupplyer(v.id)}
          />
        </GridItem>

        <GridItem xs={12} sm={3} md={2}>
        <TextField
            size="small"
            id="standard-basic"
            variant="outlined"
            type="text"
            label="Memo Number"
            value={memoNumner}
            onChange={(e) => setMemoNumber(e.target.value)}
            style={{ width: "100%" }}
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
              productType="Buy"
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
              handdletotalPriceChange={handdletotalPriceChange}
            />
          )}
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          {selectedProductList.length > 0 && (
            <Calculation
              products={selectedProductList}
              subTotal={subTotal}
              setSubTotal={setSubTotal}
              grand={grand}
              setGrand={setGrand}
              paid={paid}
              setPaid={setPaid}
              due={due}
              setDue={setDue}
              discountAmount={discountAmount}
              setDiscountAmount={setDiscountAmount}
              discountType={discountType}
              setDiscountType={setDiscountType}
              discountParcent={discountParcent}
              setDiscountParcent={setDiscountParcent}
              afterDiscountAmount={afterDiscountAmount}
              setAfterDiscountAmount={setAfterDiscountAmount}
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              lessAmount={lessAmount}
              afterLessAmount={afterLessAmount}
            />
          )}
        </GridItem>

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
              // className={classes.button}
              // endIcon={<Icon>send</Icon>}
            >
              {submitButtonLoading ? "loading" : "Submit"}
            </Button>
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Create;
