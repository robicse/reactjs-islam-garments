import React, { useEffect } from "react";
import cogoToast from "cogo-toast";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import GridContainer from "components/Grid/GridContainer";
import { useAsyncEffect } from "use-async-effect";
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Typography,
  Select,
} from "@material-ui/core";

export default function SearchByDrpdown({
  searchBody,
  handleProductAdd,
  idRequired,
  endpoint,
}) {

  console.log(
    handleProductAdd,
    idRequired,
    endpoint,
     )
  const [sizeList, setSizeList] = React.useState([]);
  const [unitList, setUnitList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);
  const [subunitList, setSubUnitList] = React.useState([]);

  const [selectedType, setSelectedType] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [selectedUnit, setSelectedUnit] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubUnit, setSelectedSubUnit] = React.useState(null);
  
  useAsyncEffect(async (isMounted) => {
    try {
      const sizeRes = await axios.get(
        endpoint.sizesActiveListUrl,
        endpoint.headers
      );
      const unitRes = await axios.get(
        endpoint.unitActiveListUrl,
        endpoint.headers
      );
      const categoryRes = await axios.get(
        endpoint.categoryActiveListUrl,
        endpoint.headers
      );
      const subUnitRes = await axios.get(
        endpoint.subUnitActiveListUrl,
        endpoint.headers
      );

      setSizeList(sizeRes?.data?.data);
      setUnitList(unitRes?.data?.data);
      setCategoryList(categoryRes?.data?.data);
      setSubUnitList(subUnitRes?.data?.data);
    } catch (error) {
      console.log(error.response);
    }
  }, []);

  const productSearchHandle = async (
    type,
    product_category_id,
    product_unit_id,
    product_size_id,
    product_sub_unit_id
  ) => {

    if(idRequired && !searchBody ) {
      return cogoToast.warn('Please select warehouse/Store',{position: 'top-right', bar:{size: '10px'}});
    }
    const body = {
      ...searchBody,
      type,
      product_category_id,
      product_unit_id,
      product_size_id,
      product_sub_unit_id
    };

    const data = new FormData();
    Object.keys(body).forEach((key) => data.append(key, body[key]));

    try {
      const response = await axios.post(
        endpoint.productFintByDeopDownItemAPi,
        data,
        endpoint.headers
      );
      handleProductAdd(response?.data?.data?.data[0]);

      console.log(response?.data?.data?.data[0]);
    } catch (error) {
      console.log(error);
      cogoToast.info("Product Not Found", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }
  };

  useEffect(() => {

      if(selectedUnit?.name == 'Pcs'){
        setSelectedSubUnit("")
      }
    if (selectedType && selectedCategory && selectedUnit && selectedSize || selectedSubUnit) {
      productSearchHandle(
        selectedType,
        selectedCategory,
        selectedUnit?.id,
        selectedSize,
        selectedSubUnit
      );
    }

  }, [selectedType, selectedCategory, selectedUnit, selectedSize,selectedSubUnit]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={3} md={3}>
          <Autocomplete
            size="small"
            fullWidth={true}
            id="combo-box-demo"
            // value={selectedType}
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
            // value={selectedCategory}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Category" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedCategory(v.id)}
          />
        </GridItem>

        <GridItem xs={12} sm={2} md={2}>
          <Autocomplete
            size="small"
            id="combo-box-demo"
            // value={selectedUnit}
            options={unitList}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Unit" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedUnit(v)}
          />
        </GridItem>

        {selectedUnit?.name == "Bundle" && (
          <GridItem xs={12} sm={3} md={2}>
            <Autocomplete
              size="small"
              id="combo-box-demo"
              // value={selectedUnit}
              options={subunitList}
              getOptionLabel={(option) => option.sub_unit_name}
              renderInput={(params) => (
                <TextField {...params} label="Sub Unit" variant="outlined" />
              )}
              onChange={(e, v) => setSelectedSubUnit(v.id)}
            />
          </GridItem>
        )}

        <GridItem xs={12} sm={3} md={2}>
          <Autocomplete
            size="small"
            id="combo-box-demo"
            options={sizeList}
            // value={selectedSize}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Product Size" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedSize(v.id)}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
