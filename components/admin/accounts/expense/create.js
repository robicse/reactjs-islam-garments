


import React from "react";
// @material-ui/core components
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import cogoToast from "cogo-toast";
// core components
import { useAsyncEffect } from "use-async-effect";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Grid from "@material-ui/core/Grid";
import { Button, MenuItem,TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { baseUrl } from "const/api";
import AllApplicationErrorNotification from '../../../utils/errorNotification';

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
  submit: {
    marginTop:'25px'
  }
};

const useStyles = makeStyles(styles);

const Create = ({ token, modal, handleRefress }) => {
  const classes = useStyles();

  const endpoint = {
    warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
    storeActiveListUrl: `${baseUrl}/store_active_list`,
    categoryActiveListUrl: `${baseUrl}/expense_category_list`,
    expenseCreateUrl: `${baseUrl}/expense_create`,
    
    headers: { headers: { Authorization: "Bearer " + token } },
  };

  const [warehouseList, setWarehouseList] = React.useState([]);
  const [storeList, setStoreList] = React.useState([]);
  const [expenseTypeList, setExpenseTypeList] = React.useState([]);

  const [selectedDate, setSelectedDate] = React.useState(null);
  const [expenseFrom, setExpenseFrom] = React.useState("Warehouse");
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [selectedStore, setSelecteStore] = React.useState(null);
  const [amount, setAmout] = React.useState(0);
  const [selectedExpenseCategory, setSelectedExpenseCategory] =
    React.useState(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
      const categoryRes = await axios.get(
        endpoint.categoryActiveListUrl,
        endpoint.headers
      );

      setWarehouseList(warehouseRes?.data?.data);
      setStoreList(storeRes?.data?.data);
      setExpenseTypeList(categoryRes?.data?.data)
     
    } catch (error) {
      console.log(error);
    }
  }, []);
  console.log(expenseTypeList)
  // handle sitock in create
  const handleFinalStockInCreate = async () => {
    // if (!selectedDate) {
    //   return cogoToast.warn("Please Select Date", {
    //     position: "top-right",
    //     bar: { size: "10px" },
    //   });
    // }
console.log(selectedWarehouse, selectedStore)
    if (!selectedWarehouse && !selectedStore) {
      return cogoToast.warn("Please Select Warehouse/Store", {
        position: "top-right",
        bar: { size: "10px" },
      });
    }

 

    const body = {
      // date: selectedDate,
      expense_from: expenseFrom,
      warehouse_id: selectedWarehouse,
      store_id: selectedStore,
      expense_category_id: selectedExpenseCategory,
      amount: amount,
      payment_type_id: 1,
      status: 1,
    };
console.log(body)
    // convert formdata
    const data = new FormData();
    Object.keys(body).forEach((key) => data.append(key, body[key]));

    try {
      setIsSubmitting(true);
      setTimeout(()=>{
      console.log('timeout')
      },3000)
      cogoToast.success("Submit Success", {
        position: "top-right",
        bar: { size: "10px" },
      });
      console.log(data)
      await axios.post(endpoint.expenseCreateUrl, body, endpoint.headers);
      handleRefress();
      setIsSubmitting(false);
      modal(false);
    } catch (error) {
      console.log(error)
      AllApplicationErrorNotification(error);
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
              <Autocomplete
            size="small"
            fullWidth={true}
            id="combo-box-demo"
            // value={selectedType}
            options={[
              {
                name: "Warehouse",
              },
              {
                name: "Store",
              },
            ]}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Type" variant="outlined" />
            )}
            onChange={(e, v) => setExpenseFrom(v?.name)}
          />

                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
              { expenseFrom == 'Warehouse' &&    <Autocomplete
                    size="small"
                    fullWidth={true}
                    // value={selectedWarehouse}
                    id="combo-box-demo"
                    options={warehouseList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Warehouse"
                        variant="outlined"
                      />
                    )}
                    onChange={(e, v) => {
                      setSelecteStore(null)
                      setSelectedWarehouse(v.id)}

                    }
                  />
                    }
              { expenseFrom == 'Store' &&     <Autocomplete
                    size="small"
                    fullWidth={true}
                    // value={selectedWarehouse}
                    id="combo-box-demo"
                    options={storeList}
                    getOptionLabel={(option) => option.store_name}
                    renderInput={(params) => (
                      <TextField {...params} label="Store" variant="outlined" />
                    )}
                    onChange={(e, v) =>{
                      setSelecteStore(v.id)
                      setSelectedWarehouse(null)

                    } }
                  />
                    }
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                  <Autocomplete
                    size="small"
                    fullWidth={true}
                    // value={selectedWarehouse}
                    id="combo-box-demo"
                    options={expenseTypeList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="Expense Category" variant="outlined" />
                    )}
                    onChange={(e, v) => setSelectedExpenseCategory(v.id)}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                <TextField size="small" value={amount} label="Amount" variant="outlined"  onChange={(e)=>setAmout(e.target.value)}/>
                  </GridItem>
             

       
              </GridContainer>
              <div style={{textAlign:"center"}}>
              <Button
                   
                   // fullWidth
                   variant="contained"
                   color="primary"
                   className={classes.submit}
                   disabled={isSubmitting}
                   onClick={handleFinalStockInCreate}
                 >
                   {isSubmitting ? (
                     <CircularProgress color="primary" size={24} />
                   ) : (
                     "SUBMIT"
                   )}
                 </Button>
                </div>
      
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Create;
