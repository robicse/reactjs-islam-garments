import React, { useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import cogoToast from 'cogo-toast';
import GridContainer from "components/Grid/GridContainer.js";;
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { Box, Button, FormControlLabel, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import AllApplicationErrorNotification from '../../utils/errorNotification';


import {
  Autocomplete,
} from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
import ProductImageUpload from "./productImageUpload";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Create = ({ token, modal,endpoint, mutate }) => {
 
  const classes = useStyles();
  const [insertedProduct, setInsertedProduct] = React.useState(null);
  const [openUpload, setOpenupload] = React.useState(false);
  const [submitAllow, setSubmitAllow] = React.useState(false);

  
  const handleClickOpenUpload = () => {
    setOpenupload(true);
  };
  const handleCloseUpload = () => {
    setOpenupload(false);
    mutate();
    modal(false);
  };

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  

  const [sizeList, setSizeList] = React.useState([]);
  const [unitList, setUnitList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);

  const [image, setImage] = React.useState(null);
  

  useAsyncEffect(async (isMounted) => {
    await axios
      .all([
        axios.get(endpoint.sizesUrl, endpoint.headers),
        axios.get(endpoint.unitUrl,endpoint.headers),
        axios.get(endpoint.categoryUrl,endpoint.headers),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          const responseThree = responses[2];
          setSizeList(responseOneB.data.data);
          setUnitList(responseTwoU.data.data);
          setCategoryList(responseThree.data.data);
          // setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        // setLoad(false);
      });
  }, []);

const handleDuplicateProduct = async(type,product_category_id, product_unit_id, product_size_id)=>{
  const body = {
    type,
    product_category_id,
    product_unit_id,
    product_size_id,
  }

  try {
   const response =  await axios.post(endpoint.productDuplicateSearchUrl,body,endpoint.headers);
   

        
   if(response?.data?.code == 200){
   return setSubmitAllow(true)

  }
  
  setSubmitAllow(false)
  } catch (error) {
       
   if(error?.response?.data?.code == 409){
    setSubmitAllow(false)
    cogoToast.info('Product Alreday Exits',{position: 'top-right', bar:{size: '10px'}});
  }

  }

}



const uploadImageHnadle= (img) => {
  setImage(img)
 }

 
  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
      
          <Card>
          
            <CardBody>
              <Formik
                initialValues={{
                  type_name: "",
                  unit_name: "",
                  size_name: "",
                  category_name: "",
                  item_code: "",
                  purchase_price: "",
                  note: "",
                  status: "1",
                }}
                validate={(values) => {
                  const errors = {};

                  if (!values.type_name) {
                    errors.type_name = "Required";
                  }

                  if (!values.category_name) {
                    errors.type_name = "Required";
                  }

              

                  if (!values.unit_name) {
                    errors.unit_name = "Required";
                  }

                  if (!values.size_name) {
                    errors.size_name = "Required";
                  }

              


                  if (values.type_name && values.category_name && values.unit_name && values.size_name) {
                    const functionResult =   handleDuplicateProduct(values.type_name,values?.category_name?.id,values?.unit_name.id,values?.size_name.id)
                     
                  
                  }
                   
              
              
                
                  if (!values.item_code) {
                    errors.item_code = "Required";
                  }

                     
                  if (!values.purchase_price) {
                    errors.purchase_price = "Required";
                  }
             
               
              

                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                            

                  if (!submitAllow) {
                    setSubmitting(false);
                    return cogoToast.info('Product Alreday Exits',{position: 'top-right', bar:{size: '10px'}});
                  }


                     const body = {
                      type:values.type_name,
                      product_category_id: values.category_name.id,
                      product_unit_id: values.unit_name.id,
                      product_size_id: values.size_name.id,
                      product_code: values.item_code,
                      purchase_price: values.purchase_price,
                      selling_price:  values.purchase_price,
                      whole_sale_price: values.purchase_price,
                      status: values.status,
                      note: values.note,
                      vat_status: '0',
                      vat_percentage:'0',
                      vat_amount: '0',
                      vat_whole_amount: '0',
                      image:image,

                     }

                     const formData = new FormData();
                     Object.keys(body).forEach(key => formData.append(key, body[key]));
        
              

                  setTimeout(() => {
                    Axios.post(
                     endpoint.createAPi,
                     formData,
                      {
                        headers: {
                           Authorization: "Bearer " + token,
                           'Content-type': 'multipart/form-data'
                      },
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

                        <GridItem xs={6} sm={4} md={3}>
                            <Field
                              component={TextField}
                              type="text"
                              name="type_name"
                              label="Type"
                              select
                              fullWidth
                              variant="outlined"
                              // helperText="Please select status"
                              margin="normal"
                            >
                              <MenuItem value="Own">Own</MenuItem>
                              <MenuItem value="Buy">Buy</MenuItem>
                            </Field>
                          </GridItem>

                          <GridItem xs={12} sm={4} md={3}>
                         
                         <Field
                           name="category_name"
                           component={Autocomplete}
                           options={categoryList}
                           getOptionLabel={(option) => option.name}
                           renderInput={(params) => (
                             <MuiTextField
                               {...params}
                               label="Category"
                               variant="outlined"
                               fullWidth
                               // helperText="Please select unit"
                               margin="normal"
                             />
                           )}
                         />
                      
                     </GridItem>


                          <GridItem xs={12} sm={4} md={3}>
                         
                              <Field
                                name="unit_name"
                                component={Autocomplete}
                                options={unitList}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Unit"
                                    variant="outlined"
                                    fullWidth
                                    // helperText="Please select unit"
                                    margin="normal"
                                  />
                                )}
                              />
                           
                          </GridItem>



                          <GridItem xs={12} sm={4} md={3}>
                        
                              <Field
                                name="size_name"
                                component={Autocomplete}
                                options={sizeList}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Size"
                                    variant="outlined"
                                    fullWidth
                                    // helperText="Please select unit"
                                    margin="normal"
                                  />
                                )}
                              />
                         
                          </GridItem>





                          <GridItem xs={12} sm={4} md={3}>
                            <Field
                              component={TextField}
                              name="item_code"
                              type="text"
                              label="Item Code"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                            />
                          </GridItem>

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

                  
                    
                          <GridItem xs={12} sm={4} md={3}>
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
                              type="text"
                              label="Note"
                              name="note"
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
                              name="image"
                              onChange={(e)=>{
                                uploadImageHnadle(e.target.files[0])
                            
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
              <Dialog
                open={openUpload}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseUpload}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">
                  Select Product Image For Upload
                </DialogTitle>
                <DialogContent>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <ProductImageUpload
                      product={insertedProduct}
                      token={token}
                      modal={modal}
                      mutate={mutate}
                    />
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseUpload}
                    color="primary"
                    variant="outlined"
                  >
                    Save and Exit
                  </Button>
                </DialogActions>
              </Dialog>

            </CardBody>
    
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};



export default Create;
