import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import TextField from "@material-ui/core/TextField";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import cogoToast from "cogo-toast";
import Grid from "@material-ui/core/Grid";
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import MuiTextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import AllApplicationErrorNotification from "../../utils/errorNotification";
import Productstable from "./utils/Productstable";

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
const Create = ({ endpoint }) => {
  const classes = useStyles();

  const [openModal, setModalOpen] = React.useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [total, setTotal] = React.useState(0);
  const [paid, setPaid] = React.useState(0);
  const [due, setDue] = React.useState(0);
  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [store, setStore] = React.useState(null);
  const [warehouse, setWarehouse] = React.useState([]);
  const [warehouse_id, setWarehouseId] = React.useState(null);

  const [warehouseList, setWarehouseList] = React.useState([]);
  const [supplyerList, setSupplyerList] = React.useState([]);
  const [sizeList, setSizeList] = React.useState([]);
  const [unitList, setUnitList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);

  const [selectedType, setSelectedType] = React.useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [selectedSupplyer, setSelectedSupplyer] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [selectedUnit, setSelectedUnit] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const fakeProduct = [
    {
      id: 1,
      category_name: "test_category",
      image: "default.png",
      product_code: "324523",
      product_name: "2-1-3",
      purchase_price: 100,
      size_name: "XL",
      type: "Own",
      unit_name: "Pcs",
      qty: 1,
    },
    {
      id: 2,
      category_name: "test_category2",
      image: "default.png",
      product_code: "444",
      product_name: "2-1-3",
      purchase_price: 200,
      size_name: "XL",
      type: "Own",
      unit_name: "Pcs",
      qty: 1,
    },
  ];

  const [selectedProductList, setSelectedProduct] = React.useState([]);

  const handdleQuantityChange = (prodId, qty) => {
    if (qty < 0) {
      return cogoToast.error("Enter Valid QTY", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

    setSelectedProduct(
      selectedProductList.map((item) =>
        item.id === prodId ? { ...item, qty: qty || 0 } : item
      )
    );
  };
  const handdleproductRemove = (proId) => {
    console.log("remove done");
    const filterList = selectedProductList.filter((item) => item.id !== proId);
    setSelectedProduct(filterList);
    cogoToast.success("Removed", {
      position: "top-right",
      bar: { size: "10px" },
    });
  };

  useAsyncEffect(async (isMounted) => {
    await axios
      .all([
        axios.get(endpoint.warehouseActiveListUrl, endpoint.headers),
        axios.get(endpoint.supplyerActiveListUrl, endpoint.headers),
        axios.get(endpoint.sizesActiveListUrl, endpoint.headers),
        axios.get(endpoint.unitActiveListUrl, endpoint.headers),
        axios.get(endpoint.categoryActiveListUrl, endpoint.headers),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const warehouseRes = responses[0];
          const supplyerRes = responses[1];
          const sizeRes = responses[2];
          const unitRes = responses[3];
          const categoryRes = responses[4];
          console.log(warehouseRes?.data);
          setWarehouseList(warehouseRes?.data?.data);
          setSupplyerList(supplyerRes?.data?.data);
          setSizeList(sizeRes?.data?.data);
          setUnitList(unitRes?.data?.data);
          setCategoryList(categoryRes?.data?.data);

          // setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        // setLoad(false);
      });
  }, []);

  const productSearchHandle = async (
    type,
    product_category_id,
    product_unit_id,
    product_size_id
  ) => {
    const body = {
      type,
      product_category_id,
      product_unit_id,
      product_size_id,
    };

    try {
      const response = await axios.post(
        endpoint.productFindForStockIn,
        body,
        endpoint.headers
      );
      console.log( response.data.data[0]);

      if (response.data.data.length) {
            if(!selectedProductList.length){
            return  setSelectedProduct([response.data.data[0]]);
            }

        const filterList = selectedProductList.filter((item) => {
          if (item.id == response.data.data[0].id) {
            cogoToast.info("Product Alreday Exits", {
              position: "top-right",
              bar: { size: "10px" },
            });
          } else {
            setSelectedProduct([...selectedProductList, response.data.data[0]]);
            cogoToast.info("Product Added", {
              position: "top-right",
              bar: { size: "10px" },
            });
          }
        });
    
      }

      // if(response.data.success){
      // console.log('ok');
      // //   return response.data.success
      // }else{
      //   cogoToast.info('Product Alreday Exits',{position: 'top-right', bar:{size: '10px'}});
      // }
    } catch (error) {
      console.log(error);
      cogoToast.info("Product Not Found", {
        position: "top-right",
        bar: { size: "10px" },
      });
      //
      // cogoToast.info('Name is available',{position: 'top-right', bar:{size: '10px'}});
      // return false
    }
  };

  useEffect(() => {
    if (selectedType && selectedCategory && selectedUnit && selectedSize) {
      productSearchHandle(
        selectedType,
        selectedCategory,
        selectedUnit,
        selectedSize
      );
    }
  }, [selectedType, selectedCategory, selectedUnit, selectedSize]);

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={3} md={3}>
          <TextField
            size="small"
            id="standard-basic"
            variant="outlined"
            type="date"
            style={{ width: "100%" }}
          />
        </GridItem>
        <GridItem xs={12} sm={3} md={3}>
          <Autocomplete
            fullWidth={true}
            size="small"
            id="combo-box-demo"
            options={supplyerList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Supplyer" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedSupplyer(v)}
          />
        </GridItem>

        <GridItem
          xs={12}
          sm={3}
          md={3}
          style={{ textAlign: "center", marginTop: "10px" }}
        >
          <ArrowForwardIcon size="large" />
        </GridItem>

        <GridItem xs={12} sm={3} md={3}>
          <Autocomplete
            size="small"
            fullWidth={true}
            id="combo-box-demo"
            options={warehouseList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Warehouse" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedWarehouse(v.id)}
          />
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h6" style={{ padding: "10px" }}>
            {" "}
            product Select
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={3} md={3}>
          <Autocomplete
            size="small"
            fullWidth={true}
            id="combo-box-demo"
            options={[
              {
                name: "Own",
                id: 1,
              },
              {
                name: "Buy",
                id: 2,
              },
            ]}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Type" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedType(v?.name)}
          />
        </GridItem>

        <GridItem xs={12} sm={3} md={3}>
          <Autocomplete
            size="small"
            id="combo-box-demo"
            options={categoryList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Category" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedCategory(v.id)}
          />
        </GridItem>

        <GridItem xs={12} sm={2} md={3}>
          <Autocomplete
            size="small"
            id="combo-box-demo"
            options={unitList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Unit" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedUnit(v.id)}
          />
        </GridItem>

        <GridItem xs={12} sm={3} md={3}>
          <Autocomplete
            size="small"
            id="combo-box-demo"
            options={sizeList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Product Size" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedSize(v.id)}
          />
        </GridItem>

        {/* 
<GridItem xs={12} sm={2} md={2}>
  price
</GridItem>
<GridItem xs={12} sm={2} md={2}>
  add
</GridItem> */}
        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h6" style={{ padding: "10px" }}>
            {" "}
            product List
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Productstable
            products={selectedProductList}
            handdleproductRemove={handdleproductRemove}
            handdleQuantityChange={handdleQuantityChange}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Create;
