import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import cogoToast from "cogo-toast";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import { Autocomplete } from "formik-material-ui-lab";
import { Autocomplete as ReactAutoComplete } from "@material-ui/lab";
import MuiTextField from "@material-ui/core/TextField";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
// import CreateCustomer from '../product_pos_sale/create/CreateCustomer';
import { TextField as MTextField } from "@material-ui/core";

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
const Create = ({ token, modal, mutate, handlePrint, user }) => {
  const classes = useStyles();

  const [load, setLoad] = React.useState(false);
  const [lagerHeadList, setLagerHeadList] = React.useState([]);
  const [voucherList, setVoucherList] = React.useState([]);
  const [voucherId, setVoucherId] = React.useState(null);
  const [warehouseList, setWarehouseList] = React.useState([]);
  const [storeList, setStoreList] = React.useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
  const [selectedStore, setSelecteStore] = React.useState(null);
  const [wareOrStore, setWareOrStore] = React.useState("None");

  const endpoint = {
    createPosting: `${baseUrl}/chart_of_account_transaction_create`,
    voucherListUrl: `${baseUrl}/voucher_type_list`,
    legerActiveListUrl: `${baseUrl}/chart_of_account_is_general_ledger_list`,
    warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
    storeActiveListUrl: `${baseUrl}/store_active_list`,
    headers: { headers: { Authorization: "Bearer " + user.auth_token } },
  };

  //loading when component run
  useAsyncEffect(async (isMounted) => {
    try {
      const ledgerRes = await axios.get(
        endpoint.legerActiveListUrl,
        endpoint.headers
      );
      const voucherRes = await axios.get(
        endpoint.voucherListUrl,
        endpoint.headers
      );

      const formatChartOfAccount =
        ledgerRes?.data?.response?.chart_of_accounts?.map(
          (item) => item.head_name
        );

      const warehouseRes = await axios.get(
        endpoint.warehouseActiveListUrl,
        endpoint.headers
      );

      const storeRes = await axios.get(
        endpoint.storeActiveListUrl,
        endpoint.headers
      );

      setLagerHeadList(formatChartOfAccount);
      setVoucherList(voucherRes?.data?.response?.voucher_type);
      setWarehouseList(warehouseRes?.data?.data);
      setStoreList(storeRes?.data?.data);

      setLoad(true);
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(selectedWarehouse, selectedStore);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}></GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  products: [],
                  date: "",
                  warehouse: "",
                  store: "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.date) {
                    errors.date = "Required";
                  }

                  console.log(values);

                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  if (!voucherId) {
                    setSubmitting(false);
                    return cogoToast.warn("Please Select Voucher", {
                      position: "top-right",
                      bar: { size: "10px" },
                    });
                    // return alert("Please Select Voucher");
                  }

                  let debitAmount = 0;
                  let creditAmount = 0;

                  if (!values?.products.length) {
                    setSubmitting(false);
                    return cogoToast.warn("Please Fill Transaction", {
                      position: "top-right",
                      bar: { size: "10px" },
                    });
                    // return alert("Please Fill Transaction");
                  }

                  values?.products.map((tra) => {
                    if (tra.debit_or_credit == "debit") {
                      debitAmount = debitAmount + parseInt(tra.amount);
                    }
                    if (tra.debit_or_credit == "credit") {
                      creditAmount = creditAmount + parseInt(tra.amount);
                    }
                  });
                  if (debitAmount !== creditAmount) {
                    setSubmitting(false);
                    return cogoToast.warn(
                      "Debit and credit amount must be equal",
                      {
                        position: "top-right",
                        bar: { size: "10px" },
                      }
                    );
                    // return alert("Debit and credit amount must be equal");
                  }

                  if (debitAmount == 0 && creditAmount == 0) {
                    setSubmitting(false);
                    return cogoToast.warn("Please Fill Transaction Amount", {
                      position: "top-right",
                      bar: { size: "10px" },
                    });
                    // return alert("Please Fill Transaction Amount");
                  }

                  // console.log(values)
                  // setSubmitting(false);
                  const body = {
                    date: values.date,
                    voucher_type_id: voucherId,
                    transactions: JSON.stringify(values.products),
                    warehouse_id: selectedWarehouse,
                    store_id: selectedStore
                  };
                  const data = new FormData();
                  Object.keys(body).forEach((key) =>
                    data.append(key, body[key])
                  );

                  setTimeout(() => {
                    axios
                      .post(endpoint.createPosting, data, endpoint.headers)
                      .then((res) => {
                        setSubmitting(false);
                        mutate();
                        modal(false);
                        cogoToast.success("Create Success", {
                          position: "top-right",
                          bar: { size: "10px" },
                        });
                      })
                      .catch(function (error) {
                        // setOpen({
                        //   open: true,
                        //   key: Object.values(error.response.data.message),
                        //   value: Object.values(error.response.data.message),
                        // });
                        setSubmitting(false);
                        cogoToast.error("Error", {
                          position: "top-right",
                          bar: { size: "10px" },
                        });
                      });
                  });
                }}
              >
                {({ values, errors, submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={4} md={3}>
                            <Box mt={2}>
                              <FormControl
                                size="small"
                                variant="outlined"
                                className={classes.formControl}
                                fullWidth={true}
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  Vouchers
                                </InputLabel>
                                <Select
                                  size="small"
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  label="Store"
                                  onChange={(e) => setVoucherId(e.target.value)}
                                >
                                  {voucherList &&
                                    voucherList.map((str) => (
                                      <MenuItem value={str.id} key={str.id}>
                                        {str.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            </Box>
                          </GridItem>

                          <Grid item xs={3}>
                            <Field
                              size="small"
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              margin="normal"
                              type="date"
                              // helperText="When you want to create chart of account"
                              name="date"
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <FormControl
                              component="fieldset"
                              size="small"
                              style={{ marginLeft: "50px", marginTop: "-14px" }}
                            >
                              {/* <FormLabel component="legend">Gender</FormLabel> */}
                              <RadioGroup
                                aria-label="gender"
                                size="small"
                                name="gender1"
                                value={wareOrStore}
                                onChange={(e) => {
                                  setWareOrStore(e.target.value);
                                  setSelecteStore(null);
                                  setSelectedWarehouse(null);
                                }}
                              >
                                <FormControlLabel
                                  size="small"
                                  value="None"
                                  control={<Radio size="small" />}
                                  label="ALL"
                                />
                                <FormControlLabel
                                  size="small"
                                  value="Warehouse"
                                  control={<Radio size="small" />}
                                  label="Warehouse"
                                />
                                <FormControlLabel
                                  size="small"
                                  value="Store"
                                  control={<Radio size="small" />}
                                  label="Store"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>

                          <GridItem xs={12} sm={12} md={2}>
                            {wareOrStore == "Warehouse" && (
                              <Box mt={2}>
                                <FormControl
                                  size="small"
                                  variant="outlined"
                                  className={classes.formControl}
                                  fullWidth={true}
                                >
                                  <InputLabel id="demo-simple-select-outlined-label">
                                    Warehouse
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Store"
                                    onChange={(e) => {
                                      setSelectedWarehouse(e.target.value);
                                      setSelecteStore(null);
                                    }}
                                  >
                                    {warehouseList &&
                                      warehouseList.map((str) => (
                                        <MenuItem value={str.id} key={str.id}>
                                          {str.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Box>
                            )}
                            {wareOrStore == "Store" && (
                              <Box mt={2}>
                                <FormControl
                                  size="small"
                                  variant="outlined"
                                  className={classes.formControl}
                                  fullWidth={true}
                                >
                                  <InputLabel id="demo-simple-select-outlined-label">
                                    Store
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Store"
                                    onChange={(e) => {
                                      setSelecteStore(e.target.value);
                                      setSelectedWarehouse(null);
                                    }}
                                  >
                                    {storeList &&
                                      storeList.map((str) => (
                                        <MenuItem value={str.id} key={str.id}>
                                          {str.store_name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Box>
                            )}
                          </GridItem>

                          {/* <GridItem xs={12} sm={12} md={2}>
                            {wareOrStore == "Warehouse" && (
                                  <Field
                                  size="small"
                                  name={`warehouse`}
                                  component={Autocomplete}
                                  options={warehouseList}
                                  getOptionLabel={(
                                    option
                                  ) => option.name}
                                  renderInput={(params) => (
                                    <MuiTextField
                                      {...params}
                                      label="Warehouse"
                                      variant="outlined"
                                      fullWidth={true}
                                      margin="normal"
                                    />
                                  )}
                                      onChange={(e, v) => {
                                  setSelectedWarehouse(v?.id);
                                  setSelectedWarehouse(null);
                                }}
                                />
                            
                            )}
                            {wareOrStore == "Store" && (
                                <Field
                                size="small"
                                name={`store`}
                                component={Autocomplete}
                                options={storeList}
                                getOptionLabel={(
                                  option
                                ) => option.store_name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Store"
                                    variant="outlined"
                                    fullWidth={true}
                                    margin="normal"
                                  />
                                )}
                                onChange={(e, v) => {
                                  setSelecteStore(v?.id);
                                  setSelectedWarehouse(null);
                                }}
                              />
                            
                            )}
                          </GridItem>  */}

                          <GridItem xs={12} sm={12} md={12}>
                            <GridContainer>
                              <GridItem xs={12} sm={12} md={12}>
                                <FieldArray
                                  name="products"
                                  render={({
                                    insert,
                                    remove,
                                    push,
                                    replace,
                                  }) => (
                                    <GridContainer>
                                      <GridItem
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        className="row"
                                      >
                                        <Box mt={2} mb={1}>
                                          <Typography
                                            color="primary"
                                            variant="h5"
                                          >
                                            Make Transaction :
                                          </Typography>
                                        </Box>
                                      </GridItem>
                                      {values?.products?.length > 0 &&
                                        values?.products.map(
                                          (product, index) => (
                                            <>
                                              <Grid
                                                style={{
                                                  marginLeft: "10px",
                                                  marginRight: "10px",
                                                }}
                                                container
                                                direction="row"
                                                spacing={1}
                                              >
                                                <Grid item xs={4}>
                                                  {load && (
                                                    <Field
                                                      size="small"
                                                      name={`products.${index}.chart_of_account_name`}
                                                      component={Autocomplete}
                                                      options={lagerHeadList}
                                                      getOptionLabel={(
                                                        option
                                                      ) => option}
                                                      renderInput={(params) => (
                                                        <MuiTextField
                                                          {...params}
                                                          label="Chart of account name"
                                                          variant="outlined"
                                                          fullWidth={true}
                                                          margin="normal"
                                                        />
                                                      )}
                                                    />
                                                  )}
                                                </Grid>
                                                <Grid item xs={3}>
                                                  <Field
                                                    size="small"
                                                    component={TextField}
                                                    type="text"
                                                    name={`products.${index}.debit_or_credit`}
                                                    label="Debit/Credit"
                                                    select
                                                    variant="outlined"
                                                    fullWidth={true}
                                                    helperText="Please select Debit/Credit"
                                                    margin="normal"
                                                    InputLabelProps={{
                                                      shrink: true,
                                                    }}
                                                  >
                                                    <MenuItem value="debit">
                                                      Debit
                                                    </MenuItem>
                                                    <MenuItem value="credit">
                                                      Credit
                                                    </MenuItem>
                                                  </Field>
                                                </Grid>
                                                <Grid item xs={2}>
                                                  <Field
                                                    size="small"
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                    type="tel"
                                                    label="Amount"
                                                    margin="normal"
                                                    name={`products.${index}.amount`}
                                                  />
                                                </Grid>
                                                <Grid item xs={2}>
                                                  <Field
                                                    size="small"
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                    margin="normal"
                                                    type="text"
                                                    label="Description"
                                                    name={`products.${index}.description`}
                                                  />
                                                </Grid>

                                                <Grid item xs={1}>
                                                  <button
                                                    type="button"
                                                    className="secondary"
                                                    style={{
                                                      width: "100%",
                                                      height: "45%",
                                                      backgroundColor: "red",

                                                      // padding: '8px 0px',
                                                      // margin: '10px 5px',
                                                      marginTop: "15px",
                                                      border: "0px",
                                                      borderRadius: "3px",
                                                      cursor: "ponter",
                                                      color: "white",
                                                      fontWeight: "bold",
                                                    }}
                                                    onClick={() =>
                                                      remove(index)
                                                    }
                                                  >
                                                    Remove
                                                  </button>
                                                </Grid>
                                              </Grid>
                                            </>
                                          )
                                        )}

                                      <GridItem
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        className="row"
                                      >
                                        <Button
                                          size="small"
                                          variant="contained"
                                          fullWidth={true}
                                          color="secondary"
                                          style={{
                                            height: "100%",
                                            color: "#000",
                                            backgroundColor: "#0e41947a",
                                          }}
                                          onClick={() => {
                                            push({
                                              chart_of_account_name: "",
                                              debit: "",
                                              amount: "",
                                              description: "",
                                            });
                                            push({
                                              chart_of_account_name: "",
                                              debit: "",
                                              amount: "",
                                              description: "",
                                            });
                                          }}
                                        >
                                          <AddCircleOutlineIcon
                                            style={{ fontSize: 30 }}
                                          />
                                        </Button>
                                      </GridItem>
                                    </GridContainer>
                                  )}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                        <Box my={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={isSubmitting}
                            onClick={submitForm}
                          >
                            {isSubmitting ? (
                              <CircularProgress color="primary" size={24} />
                            ) : (
                              "SUBMIT"
                            )}
                          </Button>
                        </Box>
                      </form>
                    </div>
                  </div>
                )}
              </Formik>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Create;

// import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
// import cogoToast from "cogo-toast";
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";
// import Grid from "@material-ui/core/Grid";
// import { Box, Button, MenuItem, Typography,TextField } from "@material-ui/core";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import { baseUrl } from "../../../const/api";
// import { useAsyncEffect } from "use-async-effect";
// import axios from "axios";
// import  Autocomplete  from "@material-ui/lab";
// import MuiTextField from "@material-ui/core/TextField";
// import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
// import Select from "@material-ui/core/Select";
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";
// // import CreateCustomer from '../product_pos_sale/create/CreateCustomer';

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
// };
// const useStyles = makeStyles(styles);
// const Create = ({ token, modal, mutate, handlePrint, user }) => {
//   const classes = useStyles();

//   const [load, setLoad] = React.useState(false);
//   const [lagerHeadList, setLagerHeadList] = React.useState([]);
//   const [voucherList, setVoucherList] = React.useState([]);
//   const [voucherId, setVoucherId] = React.useState(null);
//   const [warehouseList, setWarehouseList] = React.useState([]);
//   const [storeList, setStoreList] = React.useState([]);
//   const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
//   const [selectedStore, setSelecteStore] = React.useState(null);
//   const [wareOrStore, setWareOrStore] = React.useState("None");

//   const endpoint = {
//     createPosting: `${baseUrl}/chart_of_account_transaction_create`,
//     voucherListUrl: `${baseUrl}/voucher_type_list`,
//     legerActiveListUrl: `${baseUrl}/chart_of_account_is_general_ledger_list`,
//     warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
//     storeActiveListUrl: `${baseUrl}/store_active_list`,
//     headers: { headers: { Authorization: "Bearer " + user.auth_token } },
//   };

//   //loading when component run
//   useAsyncEffect(async (isMounted) => {
//     try {
//       const ledgerRes = await axios.get(
//         endpoint.legerActiveListUrl,
//         endpoint.headers
//       );
//       const voucherRes = await axios.get(
//         endpoint.voucherListUrl,
//         endpoint.headers
//       );

//       const formatChartOfAccount =
//         ledgerRes?.data?.response?.chart_of_accounts?.map(
//           (item) => item.head_name
//         );

//       const warehouseRes = await axios.get(
//         endpoint.warehouseActiveListUrl,
//         endpoint.headers
//       );

//       const storeRes = await axios.get(
//         endpoint.storeActiveListUrl,
//         endpoint.headers
//       );

//       setLagerHeadList(formatChartOfAccount);
//       setVoucherList(voucherRes?.data?.response?.voucher_type);
//       setWarehouseList(warehouseRes?.data?.data);
//       setStoreList(storeRes?.data?.data);

//       setLoad(true);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   return (
//     <div>
//       <GridContainer>
//         <GridItem xs={12} sm={12} md={12}>
//           <Grid container spacing={1}>
//             <Grid item xs={2}>
//               <Box>
//                 <TextField
//                   size="small"
//                   id="standard-helperText"
//                   type="date"
//                   fullWidth={true}
//                   variant="outlined"
//                   helperText="Form"
//                   // onChange={(e) => setFrom(e.target.value)}
//                 />
//               </Box>
//             </Grid>

//             <Grid item xs={2}>
//               <TextField
//                 size="small"
//                 id="standard-select-currency"
//                 select
//                 label="Ledger Head                "
//                 fullWidth={true}
//                 variant="outlined"
//                 // disabled={true}
//                 // value={type}
//                 // onChange={handleChange}
//                 // onChange={(e) => setType(e.target.value)}
//                 // helperText="Please select general ledger head                "
//               >
//                 {/* {ledgerHeadList &&
//                   ledgerHeadList.map((gl) => (
//                     <MenuItem value={gl.head_name}>{gl.head_name}</MenuItem>
//                   ))} */}
//               </TextField>
//             </Grid>
//             <Grid item xs={2}>
//               <FormControl
//                 component="fieldset"
//                 size="small"
//                 style={{ marginLeft: "8px", marginTop: "-14px" }}
//               >
//                 {/* <FormLabel component="legend">Gender</FormLabel> */}
//                 <RadioGroup
//                   aria-label="gender"
//                   size="small"
//                   name="gender1"
//                   value={wareOrStore}
//                   onChange={(e) =>{
//                     setWareOrStore(e.target.value)
//                     setSelecteStore(null)
//                     setSelectedWarehouse(null)
//                   } }
//                 >
//                    <FormControlLabel
//                     size="small"
//                     value="None"
//                     control={<Radio size="small" />}
//                     label="ALL"
//                   />
//                   <FormControlLabel
//                     size="small"
//                     value="Warehouse"
//                     control={<Radio size="small" />}
//                     label="Warehouse"
//                   />
//                   <FormControlLabel
//                     size="small"
//                     value="Store"
//                     control={<Radio size="small" />}
//                     label="Store"
//                   />

//                 </RadioGroup>
//               </FormControl>
//             </Grid>

//             <GridItem xs={12} sm={12} md={2}>
//               {wareOrStore == "Warehouse" && (
//                 <Autocomplete
//                   size="small"
//                   fullWidth={true}
//                   // value={selectedWarehouse}
//                   id="combo-box-demo"
//                   options={warehouseList}
//                   getOptionLabel={(option) => option.name}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Warehouse"
//                       variant="outlined"
//                     />
//                   )}
//                   onChange={(e, v) => {
//                     setSelecteStore(null);
//                     setSelectedWarehouse(v.id);
//                   }}
//                 />
//               )}
//               {wareOrStore == "Store" && (
//                 <Autocomplete
//                   size="small"
//                   fullWidth={true}
//                   // value={selectedWarehouse}
//                   id="combo-box-demo"
//                   options={storeList}
//                   getOptionLabel={(option) => option.store_name}
//                   renderInput={(params) => (
//                     <TextField {...params} label="Store" variant="outlined" />
//                   )}
//                   onChange={(e, v) => {
//                     setSelecteStore(v.id);
//                     setSelectedWarehouse(null);
//                   }}
//                 />
//               )}
//             </GridItem>

//           </Grid>
//           <Card>
//             <CardBody>

//             </CardBody>
//           </Card>
//         </GridItem>
//       </GridContainer>
//     </div>
//   );
// };

// export default Create;
