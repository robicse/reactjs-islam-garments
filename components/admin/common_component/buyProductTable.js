import React from "react";
import { Field } from "formik";
import cogoToast from "cogo-toast";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
import { webUrl } from "const/api";

const ProductTable = ({
  products,
  handdleQuantityChange,
  handdleproductRemove,
  handdletotalPriceChange,
}) => {
  return (
    <>
      <TableContainer
        component={Paper}
        style={{ height: "300px", overflowY: "scroll", padding: "0px" }}
      >
        <Table
          aria-label="simple table"
          size="15px"
          padding="checkbox"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Sl</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length &&
              products?.map((product, index) => (
                <TableRow>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <Avatar
                      alt="O"
                      //  style={{padingLeft:"15px"}}
                      variant="square"
                      src=""
                      src={`${webUrl}/uploads/products/${product?.front_image}`}
                    />
                  </TableCell>

                  <TableCell align="center">{product?.category_name}</TableCell>
                  <TableCell align="center">{product?.unit_name}</TableCell>

                  <TableCell align="center">
                    <TextField
                      style={{ padding: "3px" }}
                      variant="outlined"
                      size="small"
                      id="standard-number"
                      type="number"
                      value={product?.qty}
                      onChange={(e) =>
                        handdleQuantityChange(
                          product?.id,
                       
                          e.target.value
                        )
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      style={{ padding: "3px" }}
                      variant="outlined"
                      size="small"
                      id="standard-number"
                      disabled={product?.type == "Own"}
                      type="number"
                     value={product?.temptotalPrice}
                      onChange={(e) =>
                        handdletotalPriceChange(product?.id, e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <DeleteForeverIcon
                      color="error"
                      size="small"
                      onClick={() => handdleproductRemove(product.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductTable;