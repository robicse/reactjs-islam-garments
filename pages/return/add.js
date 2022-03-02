import React from "react";
import { useState, useEffect } from "react";
// @material-ui/core components
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAsyncEffect } from "use-async-effect";
import { makeStyles } from "@material-ui/core/styles";
import tableIcons from "components/table_icon/icon";
// core components
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import cogoToast from "cogo-toast";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box, Chip, Grid, TextField, Divider } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import MuiAlert from "@material-ui/lab/Alert";
import CardHeader from "components/Card/CardHeader";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};
const useStyles = makeStyles(styles);

const title = "Ledger";
const subject = "ledger";

const AddReturn = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();

  const [saleInvoiceNumber, setSalesInvoiceNumber] = React.useState(null);
  const [selectedSupplier, setSelectedSupplier] = React.useState(null);

  const [invoiceData, setInvoiceData] = React.useState([]);

  const [load, setLoad] = React.useState([]);

  const endpoint = {
    saleInvoiceFindAPi: `${baseUrl}/whole_sale_customer_active_list`,
    purchaseInvoiceFindAPi: `${baseUrl}/whole_sale_customer_active_list`,
    headers: { headers: { Authorization: "Bearer " + user.details.token } },
  };

  const handleFindInvoice = async (invoiceNumber, invoiceType) => {

    console.log(invoiceNumber, invoiceType)

    if(invoiceType == 'sale_invoice'){

    }


    if(invoiceType == 'sale_invoice'){
        
    }
    // try {
    //   const result = await axios.post(
    //     endpoint.customerDuePaidApi,
    //     {
    //       customer_id: id,
    //       paid_amount: paid,
    //       due_amount: due,
    //     },
    //     endpoint.headers
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div>
      {/* <Card>
        <CardBody>Return</CardBody>
      </Card> */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Grid container spacing={1}>
       

            <Grid item xs={6}>
              <Card>
                <CardHeader>
                  <Typography align="center">Sale Return</Typography>
                </CardHeader>
                <CardBody>
                  <Grid container spacing={2}>
                    <Grid item xs>
                    <Typography>Invoice No:</Typography>
                    </Grid>
                    <Grid item xs>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Invoice Number"
                      fullWidth={true}
                      id="combo-box-demo"
                      onChange={(e) => setSalesInvoiceNumber(e.target.value)}
                    />

                    </Grid>
                    <Grid item xs>
                    <Button
                      size="small"
                      fullWidth={true}
                       style={{ height: "39px" }}
                      variant="contained"
                      color="primary"
                     fullWidth={true}
                      onClick={() => handleFindInvoice(saleInvoiceNumber,'sale_invoice')}
                    >
                      Submit
                    </Button>

                    </Grid>
                  </Grid>

                 
                </CardBody>
              </Card>
            </Grid>



            <Grid item xs={6}>
              <Card>
                <CardHeader>
                  <Typography align="center">Purchase Return</Typography>
                </CardHeader>
                <CardBody>
                  <Grid container spacing={2}>
                    <Grid item xs>
                    <Typography>Supplier:</Typography>
                    </Grid>
                    <Grid item xs>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Invoice Number"
                      fullWidth={true}
                      id="combo-box-demo"
                      onChange={(e) => setSalesInvoiceNumber(e.target.value)}
                    />

                    </Grid>
                    <Grid item xs>
                    <Button
                      size="small"
                      fullWidth={true}
                       style={{ height: "39px" }}
                      variant="contained"
                      color="primary"
                     fullWidth={true}
                      onClick={() => handleFindInvoice(saleInvoiceNumber,'purchase_invoice')}
                    >
                      Submit
                    </Button>

                    </Grid>
                  </Grid>

                 
                </CardBody>
              </Card>
            </Grid>




          </Grid>
          <Card>
            <CardBody>
              <Grid container direction="column" style={{ padding: 20 }}>
                <Box mt={1}>
                  {!load && (
                    <Typography variant="h5" align="center">
                      No Result
                    </Typography>
                  )}
                  {load && <Grid container spacing={1} direction="row"></Grid>}
                </Box>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
});

export default AddReturn;
