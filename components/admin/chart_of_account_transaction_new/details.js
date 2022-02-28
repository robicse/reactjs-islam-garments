import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";

import MaterialTable from "material-table";
import tableIcons from "components/table_icon/icon";

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
  cardBack: {
    color: "#FFFFFF",
    backgroundColor: "blue",
  },
};
const useStyles = makeStyles(styles);
const purchase_product = [];
const Details = ({ token, modal, editData }) => {
  const classes = useStyles();






  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  let products = `${baseUrl}/product_pos_sale_details`;

  useAsyncEffect(async (isMounted) => {
    console.log("edited data" + editData.id);
    const requestThree = axios.post(
      products,
      {
        product_sale_id: editData.id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    await axios
      .all([requestThree])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responsethree = responses[0];
          setProduct(responsethree.data.data);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);

  const columns = [
    { title: "Product", field: "product_name" },
    { title: "Unit", field: "product_unit_name" },
    // { title: "Brand", field: "product_brand_name" },

    {
      title: "MRP Price",
      field: "mrp_price",
      render: (rowData) => rowData.mrp_price + "tk",
    },
    {
      title: "Quantity",
      field: "qty",
      // render: (rowData) => rowData.qty + " " + rowData.product_unit_name,
    },
  ];

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        {load && (
          <MaterialTable
            title="Product List"
            columns={columns}
            data={product}
            icons={tableIcons}
            options={{
              actionsColumnIndex: -1,
  
              search: true,
            }}
          />
        )}
      </GridContainer>
    </div>
  );
};



export default Details;
