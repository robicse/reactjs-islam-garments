import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import { Autocomplete } from 'formik-material-ui-lab';
import MuiTextField from '@material-ui/core/TextField';
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";

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
};

const useStyles = makeStyles(styles);
 
const StaffCreate = ({ token, modal, endpoint, mutate }) => {
  const classes = useStyles();

  const [store, setStore] = React.useState(null);
  const [warehouse, setWarehouse] = React.useState([]);
  const [warehouse_id, setWarehouseId] = React.useState(null);
  let stores = `${baseUrl}/store_list`;
  let warehouses = `${baseUrl}/warehouse_list`;


  useAsyncEffect(async (isMounted) => {
    await axios
      .all([
        axios.get(stores, {
          headers: { Authorization: 'Bearer ' + token },
        }),
        axios.get(warehouses, {
          headers: { Authorization: 'Bearer ' + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          setStore(responseOneB.data.data);
          setWarehouse(responseTwoU.data.data);
          setWarehouseId(responseTwoU.data.data[0].id);

        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);




 
  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  phone: "",
                  gender: "",
                  date_of_birth: "",
                  marital_status: "",
                  present_address: "",
                  permanent_address: "",
                  status: "1",
                  blood_group:"",
                  national_id:"",
                  warehouse_id: "",
                  store_id:"",
                }}
                validate={(values) => {
                  const errors = {};
                  
                  if (!values.name) {
                    errors.name = "Required";
                  }
                  if (!values.phone) {
                    errors.phone = "Required";
                  }
                   if (!values.gender) {
                    errors.gender = "Required";
                  }

                  if (!values.marital_status) {
                    errors.marital_status = "Required";
                  }
                  if (!values.date_of_birth) {
                    errors.date_of_birth = "Required";
                  }
                  
                  
                  
                  if (!values.present_address) {
                    errors.present_address = "Required";
                  }

                        
                  if (!values.permanent_address) {
                    errors.permanent_address = "Required";
                  }

                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                   

                  if(!values.warehouse_id){
                    setSubmitting(false);
                    return alert('Please Select Warehouse')
                }

                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        gender: values.gender,
                        date_of_birth: values.date_of_birth,
            
                        marital_status: values.marital_status,
                        present_address: values.present_address,
                        permanent_address: values.permanent_address,
                        status: values.status,
                        blood_group:values.blood_group,
                        national_id:values.national_id,
                        warehouse_id: values.warehouse_id,
                        store_id: values.store_id ? values.store_id.id : null,
                      },
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    )
                      .then((res) => {
                      
                        setSubmitting(false);
                        mutate();
                        modal(false);
                      })
                      .catch(function (error) {
               
                        setSubmitting(false);
                      });
                  });
                }}
              >
                {({ submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>




                          <GridItem xs={12} sm={12} md={4}>
                          <Field
                                component={TextField}
                                type="text"
                                name="warehouse_id"
                                // value={warehouse_id}
                                select
                                label="Warehouse"
                                variant="outlined"
                                fullWidth
                             
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true,
                                }}>
                                {warehouse.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.id}
                                    onChange={() => setWarehouseId(option.id)}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Field>
                          </GridItem>
                          {/* <GridItem xs={12} sm={12} md={1}>
                            Or
                            </GridItem> */}

                          <GridItem xs={12} sm={12} md={4}>
                        <Field
                                name="store_id"
                                component={Autocomplete}
                                options={store || []}
                                getOptionLabel={(option) => option.store_name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Store"
                                    variant="outlined"
                                    fullWidth
                                 
                                    margin="normal"
                                  />
                                )}
                              />
                          </GridItem>


                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Name"
                              name="name"
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                           type="tel"
                              label="Phone"
                              name="phone"
                            />
                          </GridItem>


                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="email"
                              label="Email"
                              name="email"
                            />
                          </GridItem>
                       
                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              type="text"
                              name="gender"
                              label="Gender"
                              select
                              fullWidth
                              variant="outlined"
                            
                              margin="normal"
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Third Gender">Third Gender</MenuItem>
                            </Field>
                          </GridItem>


                          <GridItem xs={12} sm={12} md={4}>
                          <Field
                              component={TextField}
                              type="text"
                              name="blood_group"
                              label="Blood Group"
                              select
                              fullWidth
                              variant="outlined"
                           
                              margin="normal"
                            >
                              <MenuItem value="O+">O+</MenuItem>
                              <MenuItem value="O-">O-</MenuItem>
                              <MenuItem value="A+">A+</MenuItem>
                              <MenuItem value="A-">A-</MenuItem>
                              <MenuItem value="B+">B+</MenuItem>
                              <MenuItem value="B-">B-</MenuItem>
                              <MenuItem value="AB+">AB+</MenuItem>
                              <MenuItem value="AB-">AB-</MenuItem>
                            </Field>
                          </GridItem>


                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="date"
                              // label="Date of Birth"
                              name="date_of_birth"
                             
                            />
                          </GridItem>
                          {/* <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="National NUmber"
                              name="national_id"
                            />
                          </GridItem> */}

   


                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Present Address"
                              name="present_address"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Parmanent Address"
                              name="permanent_address"
                            />
                          </GridItem>
                        

                  

                       

                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              type="text"
                              name="status"
                              label="Status"
                              select
                              fullWidth
                              variant="outlined"
                           
                              margin="normal"
                            >
                              <MenuItem value="1">Active</MenuItem>
                              <MenuItem value="0">Inactive</MenuItem>
                            </Field>
                          </GridItem>
                        </GridContainer>

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

// UserProfile.layout = Admin;

export default StaffCreate;
