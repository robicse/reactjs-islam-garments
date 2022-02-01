import React from "react";
import cogoToast from 'cogo-toast';
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
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
};

const useStyles = makeStyles(styles);

function Edit({ token, modal, editData, endpoint, mutate }) {

  const classes = useStyles();


  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
        
            <CardBody>
              <Formik
                initialValues={{
                  name: editData.name,
                  status: editData.status,
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
                        product_size_id: editData.id,
                        name: values.name,
                        status: values.status,
                      },
                      {
                        headers: { Authorization: "Bearer " + token },
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
                            "UPDATE"
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
