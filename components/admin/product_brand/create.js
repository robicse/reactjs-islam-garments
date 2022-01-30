import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
//import Button from "components/CustomButtons/Button.js";
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardAvatar from 'components/Card/CardAvatar.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
import { Button, MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';

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

const CreateBrand = ({ token, modal, endpoint, mutate }) => {
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: '',
    value: [],
  });
  const [roles, setRoles] = React.useState([]);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen({
      open: false,
      key: '',
      value: [],
    });
  };

  useAsyncEffect(async (isMounted) => {
    try {
      const perList = await axios.get(`${baseUrl}/roles`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!isMounted()) return;

      if (perList.data.response.role != 0) {
        setRoles(perList.data.response.role);
      } else {
        console.log('No Permissons');
        modal(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            {/* <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Create Profile</h4>
                <p className={classes.cardCategoryWhite}>
                  Fill up all the input
                </p>
              </CardHeader> */}
            <CardBody>
              <Formik
                initialValues={{
                  name: '',
                  status: '1',
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = 'Required';
                  }
                  if (!values.status) {
                    errors.status = 'Required';
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        name: values.name,
                        status: values.status,
                      },
                      {
                        headers: { Authorization: 'Bearer ' + token },
                      }
                    )
                      .then((res) => {
                        console.log(res);
                        setSubmitting(false);
                        mutate();
                        modal(false);
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
                }}>
                {({ submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12}>
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

                          <GridItem xs={12} sm={12} md={12}>
                            <Field
                              component={TextField}
                              type="text"
                              name="status"
                              label="Status"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select status"
                              margin="normal">
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
                          onClick={submitForm}>
                          {isSubmitting ? (
                            <CircularProgress color="primary" size={24} />
                          ) : (
                            'SUBMIT'
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </Formik>
            </CardBody>
            <Snackbar
              open={errorAlert.open}
              autoHideDuration={2000}
              onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                color="error"
                style={{
                  backgroundColor: '#ff1a1a',
                  color: 'white',
                }}>
                {errorAlert.value[0]}
              </Alert>
            </Snackbar>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

// UserProfile.layout = Admin;

export default CreateBrand;
