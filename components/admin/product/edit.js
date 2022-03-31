import React,{useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import cogoToast from "cogo-toast";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button, MenuItem} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
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

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImag] = useState(null);
  const [sizeList, setSizeList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [subunitList, setSubUnitList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productType, setProductType] = useState(editData.type);
  //const [unitType, setUnitType] = useState(editData.unit_name);
  const [unitType, setUnitType] = useState(editData.unit_id);

  //console.log('endpoint',endpoint)
  // console.log('editData',editData)
  // console.log('unitType',unitType)

  // load data
  useAsyncEffect(async (isMounted) => {
    await axios
      .all([
        axios.get(endpoint.sizesUrl, endpoint.headers),
        axios.get(endpoint.unitUrl, endpoint.headers),
        axios.get(endpoint.subunitUrl, endpoint.headers),
        axios.get(endpoint.categoryUrl, endpoint.headers),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          const responseTwoSU = responses[2];
          const responseThree = responses[3];
          setSizeList(responseOneB.data.data);
          setUnitList(responseTwoU.data.data);
          setSubUnitList(responseTwoSU.data.data);
          setCategoryList(responseThree.data.data);
          // setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        // setLoad(false);
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
                  id: editData.id,
                  type: editData.type,
                  category_name: editData.category_id,
                  unit_name: editData.unit_id,
                  size_name: editData.size_id,
                  sub_unit_name: editData.sub_unit_id,
                  product_code: editData.product_code,
                  name: editData.name,
                  purchase_price: editData.purchase_price,
                  color: editData.color,
                  design: editData.design,
                  note: editData.note,
              
                }}
                validate={(values) => {
                  
                  console.log('values',values)

                  const errors = {};

                  // if (values.unit_name) {
                  //   setUnitType(values?.unit_name?.name);
                  // }
                  // if (values.unit_name?.name == "Pcs") {
                  //   values.sub_unit_name = "";
                  // }

                  if (values.type) {
                    setProductType(values?.type);
                  }

                  // if (values.type  == "Own") {
                  //   if (!values.product_code) {
                  //     errors.product_code = "Required";
                  //   }

                  //   if (!values.size_name) {
                  //     errors.size_name = "Required";
                  //   }
                  // }
                  
                  if (values.unit_name) {
                    setUnitType(values?.unit_name);
                  }
                  if (values.unit_name == "1") {
                    values.sub_unit_name = "";
                  }

                  console.log('unit_name from values',values.unit_name)

                     
                  // if (!values.purchase_price) {
                  //   errors.purchase_price = "Required";
                  // }
             
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  const body = {
                    product_id: values.id,
                    type: values.type,
                    product_code: values.product_code,
                    //name: values.name,
                    //product_category_id: values.category_name.id,
                    product_category_id: values.category_name,
                    //product_unit_id: values.unit_name,
                    product_unit_id: unitType,
                    product_sub_unit_id: values.unit_name
                      ? values.sub_unit_name
                      : "",
                    product_size_id: values.size_name
                      ? values.size_name
                      : "",
                    purchase_price: values.purchase_price,
                    color: values.color,
                    design: values.design,
                    note: values.note,
                    front_image: frontImage,
                    back_image: backImage,
                  };

                  const formData = new FormData();
                  Object.keys(body).forEach((key) =>
                    formData.append(key, body[key])
                  );
                  setTimeout(() => {
                    Axios.post(`${baseUrl}/${endpoint.edit}`, formData, {
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
                          <GridItem xs={12} sm={4} md={3}>
                            <Field
                              component={TextField}
                              name="name"
                              type="text"
                              // label="Name"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              disabled
                            />
                          </GridItem>

                          <GridItem xs={6} sm={4} md={3}>
                            <Field
                              component={TextField}
                              type="text"
                              name="type"
                              //value={productType}
                              label="Type"
                              select
                              fullWidth
                              variant="outlined"
                              //onChange={(e) => setProductType(e.target.value)}
                              margin="normal"
                              
                            >
                              <MenuItem value="Own">Own</MenuItem>
                              <MenuItem value="Buy">Buy</MenuItem>
                            </Field>
                          </GridItem>
                    
                          <GridItem xs={12} sm={4} md={3}>
                            <Field
                              component={TextField}
                              type="text"
                              name="category_name"
                              label="Category Name"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select Category"
                              margin="normal"
                            >
                              <MenuItem value={null}>Unselect</MenuItem>
                              {categoryList.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                              ))}
                            </Field>
                          </GridItem>

                          <GridItem xs={12} sm={4} md={3}>
                            <Field
                              component={TextField}
                              type="text"
                              name="unit_name"
                              label="Unit Name"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select Unit"
                              margin="normal"
                              
                            >
                              {unitList.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                              ))}
                            </Field>
                          </GridItem>

                          {/* {unitType == "Bundle" && (
                            <GridItem xs={12} sm={4} md={3}>
                              <Field
                                component={TextField}
                                type="text"
                                name="sub_unit_name"
                                label="Sub Unit Name"
                                select
                                fullWidth
                                variant="outlined"
                                helperText="Please select Sub Unit"
                                margin="normal"
                              >
                                {subunitList.map((item) => (
                                  <MenuItem value={item.id}>{item.sub_unit_name}</MenuItem>
                                ))}
                              </Field>
                            </GridItem>
                          )} */}

                          {unitType == "2" && (
                            <GridItem xs={12} sm={4} md={3}>
                              <Field
                                component={TextField}
                                type="text"
                                name="sub_unit_name"
                                label="Sub Unit Name"
                                select
                                fullWidth
                                variant="outlined"
                                helperText="Please select Sub Unit"
                                margin="normal"
                              >
                                {subunitList.map((item) => (
                                  <MenuItem value={item.id}>{item.sub_unit_name}</MenuItem>
                                ))}
                              </Field>
                            </GridItem>
                          )}

                          {productType == "Own" && (
                            <GridItem xs={12} sm={4} md={3}>
                              <Field
                                component={TextField}
                                type="text"
                                name="size_name"
                                label="Size Name"
                                select
                                fullWidth
                                variant="outlined"
                                helperText="Please select Size"
                                margin="normal"
                              >
                                {sizeList.map((item) => (
                                  <MenuItem value={item.id}>{item.name}</MenuItem>
                                ))}
                              </Field>
                            </GridItem>
                          )}

                          {productType == "Own" && (
                            <GridItem xs={12} sm={4} md={3}>
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
                          )}

                          <GridItem xs={12} sm={4} md={3}>
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

                       

                          <GridItem xs={12} sm={4} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="file"
                              // label="Image"
                              name="frontimage"
                              onChange={(e) => {
                                setFrontImage(e.target.files[0]);
                              }}
                            />
                          </GridItem>

                          <GridItem xs={12} sm={4} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="file"
                              name="backimage"
                              onChange={(e) => {
                                setBackImag(e.target.files[0]);
                              }}
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Note1"
                              name="note"
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
