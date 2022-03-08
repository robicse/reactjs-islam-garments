import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import cogoToast from 'cogo-toast';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import { Formik, Form, Field,useField } from 'formik';
import { TextField } from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
import { Button, MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Axios from 'axios';
import { baseUrl } from '../../../const/api';
import AllApplicationErrorNotification from '../../utils/errorNotification';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  submit: {
    marginTop: "30px",
  },

};

const useStyles = makeStyles(styles);

function Edit({ token, modal, editData, endpoint, mutate }) {


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

  const classes = useStyles();



  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
         
            <CardBody>
              <Formik
                initialValues={{
                  supplier_id: editData?.id,
                  name: editData?.name,
                  shop_name: editData?.shop_name,
                  phone: editData?.phone,
                  email: editData?.email,
                  address: editData?.address,
                  status: editData?.status,
                  note: editData?.note,
                  initial_due: editData?.initial_due,
          
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
       
                  const body = {
                    supplier_id: values.supplier_id,
                    name: values.name,
                    shop_name: values.shop_name,
                    phone: values.phone,
                    email: values.email,
                    address: values.address,
                    status: values.status,
                    nid_front: nidFront,
                    nid_back:nidBack,
                    image:image,
                    bank_detail_image:bank_detail_image,
                    note:values.note,
                    initial_due:values.initial_due
                    
                  }
               
                  const formData = new FormData();
                  Object.keys(body).forEach(key => formData.append(key, body[key]));

                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/supplier_update`,
                      formData,
                      {
                        headers: {
                           Authorization: "Bearer " + token,
                           'Content-type': 'multipart/form-data'
                      },
                      }
                    )
                      .then((res) => {
                        cogoToast.success('Update Success',{position: 'top-right', bar:{size: '10px'}});
                        setSubmitting(false);
                        mutate();
                        modal(false);
                      })
                      .catch(function (error) {
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
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Shop Name"
                              name="shop_name"
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
                            disabled
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Initial Due"
                              name="initial_due"
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={3}>
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
                        {/* </GridContainer> */}
                          {/* <GridItem xs={12} sm={12} md={4}>
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
                              helperText="NID Back Page"
                              // label="Image"
                              name="nid2"
                              onChange={(e)=>{
                                setNidBack(e.target.files[0])
                            
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
                              onChange={(e)=>{
                                setImage(e.target.files[0])
                            
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
                              onChange={(e)=>{
                                setBank_detail_image(e.target.files[0])
                            
                              }}
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
                          </GridItem> */}


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



export default Edit;
