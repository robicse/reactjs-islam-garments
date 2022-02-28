import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import EditComponent from "./EditComponent";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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

function Edit({ token, modal, editData, endpoint, mutate,handleCloseEdit }) {
  console.log(editData)
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
    severity: "error",
    color: "error",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen({
      open: false,
      key: "",
      value: [],
      severity: "error",
      color: "error",
    });
  };

 
  const [load, setLoad] = React.useState(false);
  const [party, setParty] = React.useState(null);
  const [vouchers, setvouchers] = React.useState(null);
  const [voucherId, setvoucherId] = React.useState(editData.voucher_type_id);
  let parties = `${baseUrl}/chart_of_account_is_transaction_list`;
  let vouch = `${baseUrl}/voucher_type_list`;

  useAsyncEffect(async (isMounted) => {
    await getStore();
    await getCustomer();
  }, []);
  const getStore = async () => {
    await axios
      .all([
        axios.get(vouch, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          const responseTwoU = responses[0];
          setvouchers(responseTwoU.data.response.voucher_type);
          setLoad(false);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };
  const getCustomer = async () => {
    await axios
      .all([
        axios.get(parties, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {

          const responseOneB = responses[0];
          setParty(responseOneB.data.response.chart_of_accounts);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };

  const fetchStock = (e) => {
    setvoucherId(e.target.value);
  };

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}></GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  products: [],
                  date: editData.transaction_date,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.date) {
                    errors.date = "Required";
                  }
                 
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {

                  if(!voucherId){
                    setSubmitting(false);
                    return alert('Please Select Voucher')
                }

                let debitAmount = 0;
                let creditAmount = 0;

                if(!values?.products.length ){
                    setSubmitting(false);
                    return alert('Please Fill Transaction')
                }

                values?.products.map((tra)=>{
                    if(tra. debit_or_credit == 'debit'){
                     debitAmount = debitAmount + parseInt(tra.amount)
                    }
                    if(tra. debit_or_credit == 'credit'){
                        creditAmount = creditAmount + parseInt(tra.amount)
                    }
                }) 
                if(debitAmount !== creditAmount){
                    setSubmitting(false);
                    return alert('Debit and credit amount must be equal')
                }
               
                if(debitAmount == 0 && creditAmount == 0 ){
                    setSubmitting(false);
                    return alert('Please Fill Transaction Amount')
                }


                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          chart_of_account_transaction_id: editData.id,
                          voucher_type_id: voucherId,
                          date: values.date,
                          transactions: values.products,
                        },
                        {
                          headers: { Authorization: "Bearer " + token },
                        }
                      )
                      .then((res) => {;
                        setSubmitting(false);;
                        mutate();
                        handleCloseEdit();
                      })
                      .catch(function (error) {
                        setOpen({
                          open: true,
                          key: Object.values(error.response.data.message),
                          value: Object.values(error.response.data.message),
                        });
                        setSubmitting(false);
                      });
                  });
                }}
              >
                {({ values, errors, submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6}>
                            {load ? (
                              <Box mt={2}>
                                <FormControl
                                  variant="outlined"
                                  className={classes.formControl}
                                  fullWidth={true}
                                >
                                  <InputLabel id="demo-simple-select-outlined-label">
                                    Vouchers
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Store"
                                    onChange={fetchStock}
                                    value={voucherId}
                                  >
                                    {vouchers &&
                                      vouchers.map((str) => (
                                        <MenuItem value={str.id} key={str.id}>
                                          {str.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Box>
                            ):<CircularProgress/>}
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            {load && (
                              <Field
                                component={TextField}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                margin="normal"
                                type="date"
                                helperText="When you want to create chart of account"
                                name="date"
                              />
                            )}
                          </GridItem>

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
                                            Edit Posting :
                                          </Typography>
                                        </Box>
                                      </GridItem>
                                      {values.products.length > 0 ?
                                        values.products.map(
                                          (product, index) => (
                                            <>
                                              <Grid
                                                container
                                                direction="row"
                                                spacing={1}
                                              >

                                                <Grid item xs={4}>
                                                  {load && (
                                                
                                                    <Field
                                                      component={TextField}
                                                      type="text"
                                                      name={`products.${index}.chart_of_account_name`}
                                                      label="Account Name"
                                                      select
                                                      variant="outlined"
                                                      fullWidth={true}
                                                      helperText="Please select Account Name"
                                                      margin="normal"
                                                      InputLabelProps={{
                                                        shrink: true,
                                                      }}
                                                    >
                                                      {party.map((acc) => (
                                                        <MenuItem
                                                          value={acc.head_name}
                                                        >
                                                          {acc.head_name}
                                                        </MenuItem>
                                                      ))}
                                                    </Field>
                                                  )}
                                                </Grid>
                                                <Grid item xs={3}>
                                                  <Field
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
                                                      height: "63%",
                                                      backgroundColor: "red",
                                                      padding: "10px 0px",
                                                      margin: "10px 0px",
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
                                        ):<CircularProgress/>}
                                      <GridItem
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        className="row"
                                      >
                                        <Button
                                          variant="contained"
                                          fullWidth={true}
                                          color="secondary"
                                          style={{
                                            height: "100%",
                                            color: "#000",
                                            backgroundColor: "#0e41947a",
                                          }}
                                          onClick={() =>
                                            push({
                                              chart_of_account_name: "",
                                              debit: "",
                                              amount: "",
                                              description: "",
                                            })
                                          }
                                        >
                                          <AddCircleOutlineIcon
                                            style={{ fontSize: 30 }}
                                          />
                                        </Button>
                                      </GridItem>

                                      <EditComponent
                                        push={push}

                                        token={token}
                   
                                        editData={editData}
                                      />
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
            <Snackbar
              open={errorAlert.open}
              autoHideDuration={2000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity={errorAlert.severity}
                color={errorAlert.color}
              >
                {errorAlert.value[0]}
              </Alert>
            </Snackbar>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
export default Edit;
