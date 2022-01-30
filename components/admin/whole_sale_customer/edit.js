import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cogoToast from 'cogo-toast';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
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
};

const useStyles = makeStyles(styles);

function Edit({ token, modal, editData, mutate }) {

  const classes = useStyles();


  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
         
            <CardBody>
              <Formik
                initialValues={{
                  party_id: editData?.id,
                  name: editData?.name,
                  phone: editData?.phone,
                  email: editData?.email,
                  address: editData?.address,
                  status: editData?.status,
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
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/customer_update`,
                      { party_id: values.party_id,
                        name: values.name,
                        phone: values.phone,
                        email: values.email,
                        customer_type: 'Whole Sale',
                        address: values.address,
                        status: values.status,
                         initial_due: values.initial_due,
                      },
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    )
                      .then((res) => {
                        console.log(res);
                        setSubmitting(false);
                        mutate();
                        modal(false);
                        cogoToast.success('Update Success',{position: 'top-right', bar:{size: '10px'}})
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
