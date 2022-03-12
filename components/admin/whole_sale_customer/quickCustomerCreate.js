import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import cogoToast from 'cogo-toast';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field,useField } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { Button, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import { baseUrl } from "../../../const/api";
import AllApplicationErrorNotification from '../../utils/errorNotification';

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
  submit:{
    marginTop:"25px"
  }
};

const useStyles = makeStyles(styles);
 
function CreateParty({ headers, modal,setSelectedCustomerData,setselectedCustomer}) {
  const classes = useStyles();


  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  name: "",
                  shop_name: "",
                  phone: "",
                  email: "",
                  address: "",
                  status: "1",
                  initial_due: 0,
                  note:"",
                
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.phone) {
                    errors.phone = "Required";
                  } else if (values.phone.length != 11) {
                    errors.phone = "Invalid Phone Number";
                  }
            
                  if (!values.name) {
                    errors.name = "Required";
                  }
                  if (!values.shop_name) {
                    errors.shope_name = "Required";
                  }
                 
                  return errors;
                }} 
                onSubmit={(values, { setSubmitting }) => {

                 
                  const body = {
                    name: values.name,
                    shop_name: values.shop_name,
                    phone: values.phone,
                    email: values.email,
                    address: values.address,
                    status: values.status,
                    initial_due:0,
                    // nid_front: nidFront,
                    // nid_back: nidBack,
                    // image: image,
                    // bank_detail_image: bank_detail_image,
                    // note: values.note,
                    // initial_due:values.initial_due,
                    // nid_front: nidFront,
                    // nid_back: nidBack,
                    // image: image,
                    // bank_detail_image: bank_detail_image,
                  };

                  const formData = new FormData();
                    Object.keys(body).forEach((key) =>
                      formData.append(key, body[key])
                    );

                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/whole_customer_create`, 
                        formData, 
                        headers
                    )
                    
                    .then((res) => {
                      console.log(res);
                      console.log(res.data?.data)
                     setSelectedCustomerData(res.data?.data)
                     setselectedCustomer(res.data?.data?.id)
                      setSubmitting(false);
                      modal(false);
                 
                      cogoToast.success('Create Success',{position: 'top-right', bar:{size: '10px'}})
                    })
                    .catch(function (error) {
                      console.log(error);
                      AllApplicationErrorNotification(error?.response?.data)

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
                          <GridItem xs={12} sm={12} md={6}>
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
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Shop Name"
                              name="shop_name"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              name="phone"
                              type="text"
                              label="Phone"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                            />
                          </GridItem>
               
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Address"
                              name="address"
                            />
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
}


export default CreateParty;