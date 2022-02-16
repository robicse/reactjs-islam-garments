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
 
function CreateParty({ token, modal, mutate, endpoint}) {
  const classes = useStyles();
  const [nidFront, setNidFront] = React.useState(null);
  const [nidBack, setNidBack] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [bank_detail_image, setBank_detail_image] = React.useState(null);

  const MyTextArea = ({ ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        {/* <label htmlFor={props.id || props.name}>{label}</label> */}
        <textarea
          className="text-area"
          rows="4"
          cols="69"
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </>
    );
  };

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  name: "",
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
                    return cogoToast.warn("Please Upload NID Front Image", {
                      position: "top-right",
                      bar: { size: "10px" },
                    });
                  }
                  if (!nidBack) {
                    setSubmitting(false);
                    return cogoToast.warn("Please Upload NID Back Image", {
                      position: "top-right",
                      bar: { size: "10px" },
                    });
                  }
                  if (!image) {
                    setSubmitting(false);
                    return cogoToast.warn("Please Upload Supplier Image", {
                      position: "top-right",
                      bar: { size: "10px" },
                    });
                  }

                  if (!bank_detail_image) {
                    setSubmitting(false);
                    return cogoToast.warn("Please Upload Bank Details Image", {
                      position: "top-right",
                      bar: { size: "10px" },
                    });
                  }
  
                  const body = {
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    address: values.address,
                    status: values.status,
                    nid_front: nidFront,
                    nid_back: nidBack,
                    image: image,
                    bank_detail_image: bank_detail_image,
                    note: values.note,
                    initial_due:values.initial_due,
                    nid_front: nidFront,
                    nid_back: nidBack,
                    image: image,
                    bank_detail_image: bank_detail_image,
                  };

                  const formData = new FormData();
                    Object.keys(body).forEach((key) =>
                      formData.append(key, body[key])
                    );

                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint.create}`, 
                      formData, 
                      {
                      headers: {
                        Authorization: "Bearer " + token,
                        "Content-type": "multipart/form-data",
                      },
                    })
                    .then((res) => {
                      console.log(res);
                      setSubmitting(false);
                      mutate();
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
                              helperText="Please select status"
                              margin="normal"
                            >
                              <MenuItem value="1">Active</MenuItem>
                              <MenuItem value="0">Inactive</MenuItem>
                            </Field>
                          </GridItem>


                            <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="tel"
                              label="Initil Balance"
                              name="initial_due"
                            />
                          </GridItem> 


                          <GridItem xs={12} sm={4} md={3}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="file"
                              // label="Image"
                              name="nid1"
                              helperText="NID Front Page"
                              onChange={(e) => {
                                setNidFront(e.target.files[0]);
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
                              helperText="NID Back Page"
                              // label="Image"
                              name="nid2"
                              onChange={(e) => {
                                setNidBack(e.target.files[0]);
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
                              helperText="Supplier"
                              // label="Image"
                              name="image_supp"
                              onChange={(e) => {
                                setImage(e.target.files[0]);
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
                              helperText="Bank Details Image"
                              // label="Image"
                              name="bank"
                              onChange={(e) => {
                                setBank_detail_image(e.target.files[0]);
                              }}
                            />
                          </GridItem>

                       

                          <GridItem xs={12} sm={4} md={3}>
                            <MyTextArea
                              name="note"
                              rows="6"
                              placeholder="Type Description."
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
