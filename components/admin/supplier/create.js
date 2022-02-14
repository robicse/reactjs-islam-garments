import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import cogoToast from "cogo-toast";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import AllApplicationErrorNotification from "../../utils/errorNotification";
import { baseUrl } from "../../../const/api";

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
    marginTop:"15px"
  }
};
 
const useStyles = makeStyles(styles);

function CreateParty({ token, modal, mutate }) {
  const classes = useStyles();
  const [nidFront, setNidFront] = React.useState(null);
  const [nidBack, setNidBack] = React.useState(null);
  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  type: "supplier",
                  // customer_type: "POS Sale",
                  name: "",
                  phone: "",
                  email: "",
                  address: "",
                  status: "1",
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
                  if (!values.address) {
                    errors.address = "Required";
                  }
                  if (!values.status) {
                    errors.status = "Required";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {


                  if (!nidFront) {
                    setSubmitting(false);
                    return cogoToast.warn('Please Upload NID Front Image',{position: 'top-right', bar:{size: '10px'}});
                  }
                  if (!nidBack) {
                    setSubmitting(false);
                    return cogoToast.warn('Please Upload NID Back Image',{position: 'top-right', bar:{size: '10px'}});
                  }

                  const body = {
                    type: values.type,
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    address: values.address,
                    status: values.status,
                    nid_front: nidFront,
                    nid_back:nidBack,
                  }

                  const formData = new FormData();
                  Object.keys(body).forEach(key => formData.append(key, body[key]));

                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/supplier_create`,
                     formData,
                      {
                        headers: {
                           Authorization: "Bearer " + token,
                           'Content-type': 'multipart/form-data'
                      },
                      }
                    )
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
                        AllApplicationErrorNotification(error?.response?.data);
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
                              name="phone"
                              type="text"
                              label="Phone"
                              variant="outlined"
                              margin="normal"
                              fullWidth
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
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Address"
                              name="address"
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
                              // helperText="Please select status"
                              margin="normal"
                            >
                              <MenuItem value="1">Active</MenuItem>
                              <MenuItem value="0">Inactive</MenuItem>
                            </Field>
                          </GridItem>



                          <GridItem xs={12} sm={4} md={3}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="file"
                              // label="Image"
                              name="image"
                              helperText="NID Front Page"
                              onChange={(e)=>{
                                setNidFront(e.target.files[0])
                              }}
                            />
                          </GridItem>

                          <GridItem xs={12} sm={4} md={3}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="file"
                              helperText="NID Backpage Page"
                              // label="Image"
                              name="image"
                              onChange={(e)=>{
                                setNidBack(e.target.files[0])
                            
                              }}
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
