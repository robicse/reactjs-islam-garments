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
} from "@material-ui/core";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import AllApplicationErrorNotification from "../../utils/errorNotification";
import Productsearch from "../common_component/productsearch";
import Productstable from "../common_component/Productstable";
import Calculation from "../common_component/calculation";

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
  const [paid, setPaid] = React.useState();
  const [due, setDue] = React.useState(0);
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [grand, setGrand] = React.useState(0);
  const [discountType, setDiscountType] = React.useState("Flat");
  const [paymentType, setPaymentType] = React.useState(1);
  const [discountParcent, setDiscountParcent] = React.useState(0);
  const [afterDiscountAmount, setAfterDiscountAmount] = React.useState(0);
  //initial load state
  const [warehouseList, setWarehouseList] = React.useState([]);
  const [supplyerList, setSupplyerList] = React.useState([]);

  // input data state
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [selectedSupplyer, setSelectedSupplyer] = React.useState(null);
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
      console.log(warehouseRes);
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
    console.log("remove done");
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
      sub_total_amount: subTotal,
      discount_type: discountType,
      discount_percent: discountParcent,
      discount_amount: discountAmount,
      after_discount_amount: afterDiscountAmount,
      grand_total_amount: grand,
      paid_amount: grand,
      due_amount: due,
      payment_type_id: 1,
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
      const submitResponse = await axios.post(
        endpoint.stockInAPi,
        data,
        endpoint.FrpmDataheaders
      );
      setButtonLoading(false);
      modal(false);
      handleRefress();
    } catch (error) {
      AllApplicationErrorNotification(error);
      setButtonLoading(false);
    }
  };

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
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

        <GridItem
          xs={12}
          sm={3}
          md={1}
          style={{ textAlign: "center", marginTop: "10px" }}
        >
          <ArrowForwardIcon size="large" />
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

        <GridItem xs={12} sm={3} md={3}>
          <div style={{ marginTop: "-8px" }}>
            <Productsearch
              searchUrl={endpoint.productsearchForStockIn}
              headerds={endpoint.headers}
              handleProductAdd={handleProductAdd}
              searchBody={ {warehouse_id:selectedWarehouse} }
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

// import React, { useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import TextField from "@material-ui/core/TextField";
// import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";
// import cogoToast from "cogo-toast";
// import Grid from "@material-ui/core/Grid";
// import {
//   Box,
//   Button,
//   LinearProgress,
//   MenuItem,
//   Typography,
// } from "@material-ui/core";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import { baseUrl } from "../../../const/api";
// import { useAsyncEffect } from "use-async-effect";
// import axios from "axios";
// import MuiTextField from "@material-ui/core/TextField";
// import Dialog from "@material-ui/core/Dialog";
// import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
// import AllApplicationErrorNotification from "../../utils/errorNotification";
// import Productstable from "../common_component/Productstable";
// import Calculation from "../common_component/calculation";

// const styles = {
//   cardCategoryWhite: {
//     color: "rgba(255,255,255,.62)",
//     margin: "0",
//     fontSize: "14px",
//     marginTop: "0",
//     marginBottom: "0",
//   },
//   cardTitleWhite: {
//     color: "#FFFFFF",
//     marginTop: "0px",
//     minHeight: "auto",
//     fontWeight: "300",
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     marginBottom: "3px",
//     textDecoration: "none",
//   },
//   cardBack: {
//     color: "#FFFFFF",
//     backgroundColor: "blue",
//   },
//   submit:{
//     marginTop:"15px"
//   }
// };
// const useStyles = makeStyles(styles);
// const Create = ({ endpoint,modal,handleRefress }) => {
//   const classes = useStyles();
//   console.log(endpoint.warehouseActiveListUrl);
//   const [openModal, setModalOpen] = React.useState(false);

//   const handleModalClose = () => {
//     setModalOpen(false);
//   };
//   const [subTotal, setSubTotal] = React.useState(0);
//   const [paid, setPaid] = React.useState();
//   const [due, setDue] = React.useState(0);
//   const [discountAmount, setDiscountAmount] = React.useState(0);
//   const [grand, setGrand] = React.useState(0);
//   const [discountType, setDiscountType] = React.useState("Flat");
//   const [paymentType, setPaymentType] = React.useState(1);
//   const [discountParcent, setDiscountParcent] = React.useState(0);
//   const [afterDiscountAmount, setAfterDiscountAmount] = React.useState(0);

//   const [warehouseList, setWarehouseList] = React.useState([]);
//   const [supplyerList, setSupplyerList] = React.useState([]);
//   const [sizeList, setSizeList] = React.useState([]);
//   const [unitList, setUnitList] = React.useState([]);
//   const [categoryList, setCategoryList] = React.useState([]);

//   const [selectedDate, setSelectedDate] = React.useState(null);
//   const [selectedType, setSelectedType] = React.useState(null);
//   const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
//   const [selectedSupplyer, setSelectedSupplyer] = React.useState(null);
//   const [selectedSize, setSelectedSize] = React.useState(null);
//   const [selectedUnit, setSelectedUnit] = React.useState(null);
//   const [selectedCategory, setSelectedCategory] = React.useState(null);
//   const [submitButtonLoading, setButtonLoading] = React.useState(false);

//   const fakeProduct = [
//     {
//       id: 1,
//       category_name: "test_category",
//       image: "default.png",
//       product_code: "324523",
//       product_name: "2-1-3",
//       purchase_price: 100,
//       size_name: "XL",
//       type: "Own",
//       unit_name: "Pcs",
//       qty: 1,
//     },
//     {
//       id: 2,
//       category_name: "test_category2",
//       image: "default.png",
//       product_code: "444",
//       product_name: "2-1-3",
//       purchase_price: 200,
//       size_name: "XL",
//       type: "Own",
//       unit_name: "Pcs",
//       qty: 1,
//     },
//   ];

//   const [selectedProductList, setSelectedProduct] = React.useState([]);

//   const handdleQuantityChange = (prodId, qty) => {
//     if (qty < 0) {
//       return cogoToast.error("Enter Valid QTY", {
//         position: "top-right",
//         bar: { size: "10px" },
//       });
//     }

//     setSelectedProduct(
//       selectedProductList.map((item) =>
//         item.id === prodId ? { ...item, qty: qty  } : item
//       )
//     );
//   };
//   const handdleproductRemove = (proId) => {
//     console.log("remove done");
//     const filterList = selectedProductList.filter((item) => item.id !== proId);
//     setSelectedProduct(filterList);
//     cogoToast.success("Removed", {
//       position: "top-right",
//       bar: { size: "10px" },
//     });
//   };

//   useAsyncEffect(async (isMounted) => {
//     try {
//       const warehouseRes = await axios.get(
//         endpoint.warehouseActiveListUrl,
//         endpoint.headers
//       );
//       console.log(warehouseRes);
//       const supplyerRes = await axios.get(
//         endpoint.supplyerActiveListUrl,
//         endpoint.headers
//       );
//       const sizeRes = await axios.get(
//         endpoint.sizesActiveListUrl,
//         endpoint.headers
//       );
//       const unitRes = await axios.get(
//         endpoint.unitActiveListUrl,
//         endpoint.headers
//       );
//       const categoryRes = await axios.get(
//         endpoint.categoryActiveListUrl,
//         endpoint.headers
//       );
//       setWarehouseList(warehouseRes?.data?.data);
//       setSupplyerList(supplyerRes?.data?.data);
//       setSizeList(sizeRes?.data?.data);
//       setUnitList(unitRes?.data?.data);
//       setCategoryList(categoryRes?.data?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   const productSearchHandle = async (
//     type,
//     product_category_id,
//     product_unit_id,
//     product_size_id
//   ) => {
//     const body = {
//       type,
//       product_category_id,
//       product_unit_id,
//       product_size_id,
//     };

//     const data = new FormData();
//     Object.keys(body).forEach(key => data.append(key, body[key]));

//     try {
//       const response = await axios.post(
//         endpoint.productFindForStockIn,
//         data,
//         endpoint.headers
//       );
//       console.log(response.data.data[0]);

//       if (response.data.data.length) {
//         if (!selectedProductList.length) {
//           return setSelectedProduct([response.data.data[0]]);
//         }

//         const filterList = selectedProductList.filter((item) => {
//           if (item.id == response.data.data[0].id) {
//             cogoToast.info("Product Alreday Exits", {
//               position: "top-right",
//               bar: { size: "10px" },
//             });
//           } else {
//             setSelectedProduct([...selectedProductList, response.data.data[0]]);
//             cogoToast.info("Product Added", {
//               position: "top-right",
//               bar: { size: "10px" },
//             });
//           }
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       cogoToast.info("Product Not Found", {
//         position: "top-right",
//         bar: { size: "10px" },
//       });
//     }
//   };

//   useEffect(() => {
//     if (selectedType && selectedCategory && selectedUnit && selectedSize) {
//       productSearchHandle(
//         selectedType,
//         selectedCategory,
//         selectedUnit,
//         selectedSize
//       );
//     }
//   }, [selectedType, selectedCategory, selectedUnit, selectedSize]);

//   const handleFinalStockInCreate = async () => {
//     if (!selectedDate) {
//       return cogoToast.warn("Please Select Date", {
//         position: "top-right",
//         bar: { size: "10px" },
//       });
//     }

//     if (!selectedSupplyer) {
//       return cogoToast.warn("Please Select Supplier", {
//         position: "top-right",
//         bar: { size: "10px" },
//       });
//     }

//     // if (!selectedProductList.lengh) {
//     //   return cogoToast.warn("Please Select Product", {
//     //     position: "top-right",
//     //     bar: { size: "10px" },
//     //   });
//     // }

//     if (subTotal < 0) {
//       return cogoToast.warn("Please Input Valid Amount", {
//         position: "top-right",
//         bar: { size: "10px" },
//       });
//     }

//     const body = {
//       "date": selectedDate,
//       "supplier_id": selectedSupplyer,
//       "warehouse_id": selectedWarehouse,
//       "products":JSON.stringify(selectedProductList),
//       "sub_total_amount": subTotal,
//       "discount_type": discountType,
//       "discount_percent": discountParcent,
//       "discount_amount": discountAmount,
//       "after_discount_amount": afterDiscountAmount,
//       "grand_total_amount": grand,
//       "paid_amount": grand,
//       "due_amount": due,
//       "payment_type_id":1,
//     };

//     const data = new FormData();
//     Object.keys(body).forEach(key => data.append(key, body[key]));

//     try {
//       setButtonLoading(true);
//       setTimeout(() => {
//         console.log("hu");
//       }, 30000);
//       cogoToast.success("Submit Success", {
//         position: "top-right",
//         bar: { size: "10px" },
//       });
//       const submitResponse = await axios.post(endpoint.stockInAPi,data,endpoint.FrpmDataheaders);
//       console.log(submitResponse)
//       setButtonLoading(false);
//       modal(false);
//       handleRefress()
//     } catch (error) {
//       AllApplicationErrorNotification(error);
//       setButtonLoading(false);
//     }
//   };

//   return (
//     <div>
//       <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
//         <GridItem xs={12} sm={3} md={3}>
//           <TextField
//             size="small"
//             id="standard-basic"
//             variant="outlined"
//             type="date"
//             // value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             style={{ width: "100%" }}
//           />
//         </GridItem>
//         <GridItem xs={12} sm={3} md={3}>
//           <Autocomplete
//             fullWidth={true}
//             size="small"
//             id="combo-box-demo"
//             // value={selectedSupplyer}
//             options={supplyerList}
//             getOptionLabel={(option) => option.name}
//             renderInput={(params) => (
//               <TextField {...params} label="Supplyer" variant="outlined" />
//             )}
//             onChange={(e, v) => setSelectedSupplyer(v.id)}
//           />
//         </GridItem>

//         <GridItem
//           xs={12}
//           sm={3}
//           md={3}
//           style={{ textAlign: "center", marginTop: "10px" }}
//         >
//           <ArrowForwardIcon size="large" />
//         </GridItem>

//         <GridItem xs={12} sm={3} md={3}>
//           <Autocomplete
//             size="small"
//             fullWidth={true}
//             // value={selectedWarehouse}
//             id="combo-box-demo"
//             options={warehouseList}
//             getOptionLabel={(option) => option.name}
//             renderInput={(params) => (
//               <TextField {...params} label="Warehouse" variant="outlined" />
//             )}
//             onChange={(e, v) => setSelectedWarehouse(v.id)}
//           />
//         </GridItem>

//         <GridItem xs={12} sm={12} md={12}>
//           <Typography variant="body1" style={{ padding: "10px" }}>
//             {" "}
//             product Select
//           </Typography>
//         </GridItem>

//         <GridItem xs={12} sm={3} md={3}>
//           <Autocomplete
//             size="small"
//             fullWidth={true}
//             id="combo-box-demo"
//             // value={selectedType}
//             options={[
//               {
//                 name: "Own",
//                 id: 1,
//               },
//               {
//                 name: "Buy",
//                 id: 2,
//               },
//             ]}
//             getOptionLabel={(option) => option.name}
//             renderInput={(params) => (
//               <TextField {...params} label="Type" variant="outlined" />
//             )}
//             onChange={(e, v) => setSelectedType(v?.name)}
//           />
//         </GridItem>

//         <GridItem xs={12} sm={3} md={3}>
//           <Autocomplete
//             size="small"
//             id="combo-box-demo"
//             options={categoryList}
//             // value={selectedCategory}
//             getOptionLabel={(option) => option.name}
//             renderInput={(params) => (
//               <TextField {...params} label="Category" variant="outlined" />
//             )}
//             onChange={(e, v) => setSelectedCategory(v.id)}
//           />
//         </GridItem>

//         <GridItem xs={12} sm={2} md={3}>
//           <Autocomplete
//             size="small"
//             id="combo-box-demo"
//             // value={selectedUnit}
//             options={unitList}
//             getOptionLabel={(option) => option.name}
//             renderInput={(params) => (
//               <TextField {...params} label="Unit" variant="outlined" />
//             )}
//             onChange={(e, v) => setSelectedUnit(v.id)}
//           />
//         </GridItem>

//         <GridItem xs={12} sm={3} md={3}>
//           <Autocomplete
//             size="small"
//             id="combo-box-demo"
//             options={sizeList}
//             // value={selectedSize}
//             getOptionLabel={(option) => option.name}
//             renderInput={(params) => (
//               <TextField {...params} label="Product Size" variant="outlined" />
//             )}
//             onChange={(e, v) => setSelectedSize(v.id)}
//           />
//         </GridItem>

//         <GridItem xs={12} sm={12} md={12}>
//           <Typography variant="h6" style={{ padding: "10px" }}>
//             {" "}
//             product List
//           </Typography>
//         </GridItem>

//         <GridItem xs={12} sm={12} md={12}>
//           <Productstable
//             products={selectedProductList}
//             handdleproductRemove={handdleproductRemove}
//             handdleQuantityChange={handdleQuantityChange}
//           />
//         </GridItem>

//         <GridItem>
//           <GridItem xs={12} sm={12} md={12}>
//             {selectedProductList.length > 0 && (
//               <Calculation
//                 products={selectedProductList}
//                 subTotal={subTotal}
//                 setSubTotal={setSubTotal}
//                 grand={grand}
//                 setGrand={setGrand}
//                 paid={paid}
//                 setPaid={setPaid}
//                 due={due}
//                 setDue={setDue}
//                 discountAmount={discountAmount}
//                 setDiscountAmount={setDiscountAmount}
//                 discountType={discountType}
//                 setDiscountType={setDiscountType}
//                 discountParcent={discountParcent}
//                 setDiscountParcent={setDiscountParcent}
//                 afterDiscountAmount={afterDiscountAmount}
//                 setAfterDiscountAmount={setAfterDiscountAmount}
//                 paymentType={paymentType}
//                 setPaymentType={setPaymentType}
//               />
//             )}
//           </GridItem>
//         </GridItem>

//         <GridItem xs={12} sm={12} md={12} style={{ textAlign: "center",marginTop:"15px" }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleFinalStockInCreate}
//             // className={classes.button}
//             // endIcon={<Icon>send</Icon>}
//           >
//             {submitButtonLoading ? "loading" : "Submit"}
//           </Button>
//         </GridItem>
//       </GridContainer>
//     </div>
//   );
// };

// export default Create;
