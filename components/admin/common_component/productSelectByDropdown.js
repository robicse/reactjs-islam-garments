import React, { useEffect } from "react";
import cogoToast from "cogo-toast";
import { baseUrl } from "const/api";
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
  productType
}) {
  const [sizeList, setSizeList] = React.useState([]);
  const [unitList, setUnitList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);
  const [subunitList, setSubUnitList] = React.useState([]);
  const [productCodeList, setProductCodeList] = React.useState([]);

  const [selectedType, setSelectedType] = React.useState(productType);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedUnit, setSelectedUnit] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedSubUnit, setSelectedSubUnit] = React.useState('');
  const [selectedProductCode, setSelectedProductCode] = React.useState('');


  console.log(productCodeList)
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
      const productCodeRes = await axios.post(
        `${baseUrl}/product_code_list`,
        {},
        endpoint.headers
      );

      setSizeList(sizeRes?.data?.data);
      setUnitList(unitRes?.data?.data);
      setCategoryList(categoryRes?.data?.data);
      setSubUnitList(subUnitRes?.data?.data);
      setProductCodeList(productCodeRes?.data?.data);
    } catch (error) {
      console.log(error.response);
    }
  }, []);

  const productSearchHandle = async (
    type,
    product_category_id,
    product_unit_id,
    product_size_id,
    product_sub_unit_id,
    productCode
  ) => {
    if (idRequired) {
      if (Object.values(searchBody).includes(null)) {
        return cogoToast.warn("Please select Warehouse/Store", {
          position: "top-right",
          bar: { size: "10px" },
        });
      }
    }
    const body = {
      ...searchBody,
      type,
      product_category_id,
      product_unit_id,
      product_size_id,
      product_sub_unit_id,
      product_code: productCode,
    };

    const data = new FormData();
    Object.keys(body).forEach((key) => data.append(key, body[key]));

    try {
      const response = await axios.post(
        endpoint.productFintByDeopDownItemAPi,
        data,
        endpoint.headers
      );

      handleProductAdd({...response?.data?.data[0], temptotalPrice:0});
    } catch (error) {
      console.log(error);
      cogoToast.info("Product Not Found", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }
  };

  // useEffect(() => {

  //     if(selectedUnit?.name == 'Pcs'){
  //       setSelectedSubUnit("")
  //     }
  //   if (selectedType && selectedCategory && selectedUnit && selectedSize && selectedProductCode ) {
  //     productSearchHandle(
  //       selectedType,
  //       selectedCategory,
  //       selectedUnit?.id,
  //       selectedSize,
  //       selectedSubUnit,
  //       selectedProductCode
  //     );
  //   }

  // }, [selectedType, selectedCategory, selectedUnit, selectedSize,selectedSubUnit, selectedProductCode]);

  const productSearchbuttonHandle = () => {
    if (selectedUnit?.name == "Pcs") {
      setSelectedSubUnit("");
    }

    productSearchHandle(
      selectedType,
      selectedCategory,
      selectedUnit?.id,
      selectedSize,
      selectedSubUnit,
      selectedProductCode
    );
  };

  // useEffect(() => {
  //   if (selectedUnit?.name == "Pcs") {
  //     setSelectedSubUnit("");
  //   }

  //   if (selectedType == "Own") {
  //     if (
  //       selectedType &&
  //       selectedCategory &&
  //       selectedUnit &&
  //       selectedSize &&
  //       selectedProductCode
  //     ) {
  //       productSearchHandle(
  //         selectedType,
  //         selectedCategory,
  //         selectedUnit?.id,
  //         selectedSize,
  //         selectedSubUnit,
  //         selectedProductCode
  //       );
  //     }
  //   }

  //   if (selectedType == "Buy") {
  //     if (selectedType && selectedCategory && selectedUnit) {
  //       productSearchHandle(
  //         selectedType,
  //         selectedCategory,
  //         selectedUnit?.id,
  //         selectedSize,
  //         selectedSubUnit,
  //         selectedProductCode
  //       );
  //     }
  //   }
  // }, [
  //   selectedType,
  //   selectedCategory,
  //   selectedUnit,
  //   selectedSize,
  //   selectedSubUnit,
  //   selectedProductCode,
  // ]);

  // console.log(selectedCategory);
  return (
    <div>
      <GridContainer>
        {/* <GridItem xs={12} sm={3} md={2}>
          <Autocomplete
            size="small"
            fullWidth={true}
            id="combo-box-demo"
            //  value={selectedType}
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
            onChange={(e, v) => {
              setSelectedSize('');
              setSelectedUnit(1);
              setSelectedSubUnit('');
              setSelectedProductCode('');
              setSelectedType(v?.name);
            }}
          />
        </GridItem> */}

        <GridItem xs={12} sm={3} md={2}>
          <Autocomplete
            size="small"
            id="combo-box-demo"
            options={categoryList}
            // value={Number(selectedCategory)}
            // inputValue={{id:Number(selectedCategory)}}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Category" variant="outlined" />
            )}
            onChange={(e, v) => setSelectedCategory(v?.id)}
          />
        </GridItem>

        {/* <GridItem xs={12} sm={12} md={3}>
                  <Autocomplete
                    size="small"
                    fullWidth={true}
                    value={{ name: editData?.expense_category_name }}
                    id="combo-box-demo"
                    options={expenseTypeList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Expense Category"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, v) => setSelectedExpenseCategory(v.id)}
                  />
                </GridItem>
                 */}

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
              onChange={(e, v) => setSelectedSubUnit(v?.id)}
            />
          </GridItem>
        )}

        {selectedType == "Own" && (
          <GridItem xs={12} sm={3} md={2}>
            <Autocomplete
              size="small"
              id="combo-box-demo"
              options={sizeList}
              // value={selectedSize}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product Size"
                  variant="outlined"
                />
              )}
              onChange={(e, v) => setSelectedSize(v?.id)}
            />
          </GridItem>
        )}

        {selectedType == "Own" && (
          <GridItem xs={12} sm={3} md={2}>
            <Autocomplete
              size="small"
              id="combo-box-demo"
              options={productCodeList || []}
              // value={selectedSize}
              getOptionLabel={(option) => option?.product_code}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product Code"
                  variant="outlined"
                />
              )}
               onChange={(e, v) => setSelectedProductCode(v?.product_code)}
            />
          </GridItem>
        )}

        <GridItem xs={12} sm={1} md={1}>
          <Button
            variant="contained"
            onClick={() => productSearchbuttonHandle()}
          >
            Search
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  );
}
