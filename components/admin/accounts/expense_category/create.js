
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import cogoToast from "cogo-toast";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { Button, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import { baseUrl } from "const/api";


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

const Create = ({ token, modal, endpoint, mutate }) => {
  const classes = useStyles();



  const [load, setLoad] = React.useState(false);
;

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  name: "",
                  status: "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = "Required";
                  }
                  if (!values.status) {
                    errors.status = "Required";
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
                        headers: { Authorization: "Bearer " + token },
                      }
                    )
                      .then((res) => {
                        console.log(res);
                        setSubmitting(false);
                        mutate();
                        modal(false);
                        cogoToast.success('Create Success',{position: 'top-right', bar:{size: '10px'}});
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
                        {!load ? (
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                              <Field
                                component={TextField}
                                type="text"
                                name="name"
                                label="Expense Category Name"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                              />
                            </GridItem>

                            <GridItem xs={12} sm={12} md={6}>
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
                          </GridContainer>
                        ) : (
                          <Grid container justify="center" alignItems="center">
                            <CircularProgress />
                          </Grid>
                        )}
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

export default Create;