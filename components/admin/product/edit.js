import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import cogoToast from "cogo-toast";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import { baseUrl } from "../../../const/api";
import Slide from "@material-ui/core/Slide";
import AllApplicationErrorNotification from "../../utils/errorNotification";

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
    marginTop: "15px",
  },
};

const useStyles = makeStyles(styles);


function Edit({ token, modal, editData, endpoint, mutate }) {


  console.log(mutate)
  const classes = useStyles();

  const [image, setImage] = React.useState(null);

  const uploadImageHnadle = (img) => {
    setImage(img);
  };

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  id: editData.id,
                  type: editData.type,
                  product_category_id: editData.category_id,
                  product_unit_id: editData.unit_id,
                  product_size_id: editData.size_id,
                  product_code: editData.product_code,
                  purchase_price: editData.purchase_price,
                  color: editData.color,
                  design: editData.design,
                  note: editData.note,
              
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.product_code) {
                    errors.item_code = "Required";
                  }

                     
                  if (!values.purchase_price) {
                    errors.purchase_price = "Required";
                  }
             
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  const body = {
                    product_id: values.id,
                    product_code: values.product_code,
                    purchase_price: values.purchase_price,
                    color: values.color,
                    design: values.design,
                    note: values.note,
                    image: image,
                  };

                  const formData = new FormData();
                  Object.keys(body).forEach((key) =>
                    formData.append(key, body[key])
                  );
                  setTimeout(() => {
                    Axios.post(`${baseUrl}/${endpoint}`, formData, {
                      headers: {
                        Authorization: "Bearer " + token,
                        "Content-type": "multipart/form-data",
                      },
                    })
                      .then((res) => {
                        setSubmitting(false);
                        mutate();
                        modal(false);
                     
                        cogoToast.success("Update Success", {
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
                              name="product_code"
                              type="text"
                              label="Product Code"
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
                              type="tel"
                              label="Price"
                              name="purchase_price"
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              name="color"
                              type="text"
                              label="Color"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              name="design"
                              type="text"
                              label="Design"
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
                              type="text"
                              label="Note"
                              name="note"
                            />
                          </GridItem>

                          <GridItem xs={12} sm={4} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="file"
                              // label="Image"
                              name="image"
                              onChange={(e) => {
                                uploadImageHnadle(e.target.files[0]);
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
