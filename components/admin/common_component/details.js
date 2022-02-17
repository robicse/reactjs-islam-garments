import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
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

const Details = ({ endpoint,id, idType}) => {
  console.log(endpoint.ProductdetailsUrl,id, idType,endpoint.headers)
  const [product, setProduct] = React.useState([]);

  useAsyncEffect(async (isMounted) => {
    let data = new FormData();
    data.append(idType, JSON.stringify(id));
    try {
      const result = await axios.post(
        endpoint.ProductdetailsUrl,
        data,
        endpoint.headers
      );
      setProduct(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const columns = [
    {

      title: "Category",
      field: "product_category_name",
    },
    { title: "Unit", field: "product_unit_name" },
    { title: "Size", field: "product_size_name" },
    {
      title: "Product Code",
      field: "product_code",
    },
    { title: "Price", field: "purchase_price" },
    {
      title: "Quantity",
      field: "qty",
    },
                                                                                   
  ];

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <MaterialTable
          title="Product List"
          columns={columns}
          data={product}
          icons={tableIcons}
          options={{
            actionsColumnIndex: -1,
            // exportButton: true,
            // grouping: true,
            search: true,
          }}
          style={{ width: "100%" }}
        />
      </GridContainer>
    </div>
  );
};


export default Details;
