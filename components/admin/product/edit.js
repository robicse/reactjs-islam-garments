import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import cogoToast from 'cogo-toast';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
import { Button, MenuItem, FormControlLabel, Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Axios from 'axios';
import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import ProductImageUploadEdit from './productImageUploadEdit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Edit({ token, modal, editData, endpoint, mutate }) {

  console.log(token)
  const classes = useStyles();

  const [insertedProduct, setInsertedProduct] = React.useState(editData);
  const [openUpload, setOpenupload] = React.useState(false);
  const handleClickOpenUpload = () => {
    setOpenupload(true);
  };
  const handleCloseUpload = () => {
    setOpenupload(false);
    mutate();
    modal(false);
  };




  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
   
            <CardBody>
              <Formik
                initialValues={{
 
                  type:editData.type,
                  product_category_id: editData.category_id,
                  product_unit_id: editData.unit_id,
                  product_size_id: editData.size_id,
                  product_code: editData.product_code,
                  purchase_price: editData.purchase_price,
                  selling_price:  editData.purchase_price,
                  whole_sale_price: editData.purchase_price,
                  status: '2',
                  note: editData.note,
                  vat_status: '0',
                  vat_percentage:'0',
                  vat_amount: '0',
                  vat_whole_amount: '0',
                }}
                validate={(values) => {
                  const errors = {};
              
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                 setTimeout(() => {

      
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        type:values.type,
                        product_category_id: values.product_category_id,
                        product_unit_id: values.product_unit_id,
                        product_size_id: values.product_size_id,
                        product_code: values.product_code,
                        purchase_price: values.purchase_price,
                        selling_price:  values.purchase_price,
                        whole_sale_price: values.purchase_price,
                        status: values.status,
                        note: values.note,
                        vat_status: '0',
                        vat_percentage:'0',
                        vat_amount: '0',
                        vat_whole_amount: '0',
                      },
                      {
                        headers: { Authorization: 'Bearer ' + token },
                      }
                    )
                      .then((res) => {
                        console.log(res);
                        setSubmitting(false);
                        setInsertedProduct(editData);
                        handleClickOpenUpload();

                        cogoToast.success('Update Success',{position: 'top-right', bar:{size: '10px'}});
                      })
                      .catch(function (error) {
                        AllApplicationErrorNotification(error?.response?.data)
                        setSubmitting(false);
                      });
                  });
                }}>
                {({ submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>

{/* 
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
                         
                          </GridItem> */}





                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              name="product_code"
                              type="text"
                              label="Item Code"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={2}>
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

                  
                    
                          {/* <GridItem xs={12} sm={12} md={2}>
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
                          </GridItem> */}


                  


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
                            'UPDATE'
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
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">
                  Select Product Image For Upload
                </DialogTitle>
                <DialogContent>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <ProductImageUploadEdit
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
                    variant="outlined">
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
}


export default Edit;
