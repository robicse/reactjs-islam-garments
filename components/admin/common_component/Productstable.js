import React from "react";
import { Field } from "formik";
import cogoToast from "cogo-toast";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { webUrl } from "const/api";

const ProductTable = ({ products, handdleQuantityChange, handdleproductRemove }) => {
    return (
        <>
            <TableContainer
                component={Paper}
                style={{ height: "300px", overflowY: "scroll", padding: "0px" }}
            >
                <Table aria-label="simple table" size="15px" padding="checkbox" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Sl</TableCell>
                            <TableCell align="center">Image</TableCell>
                            <TableCell align="center">Type</TableCell>

                            <TableCell align="center">Category</TableCell>

                            <TableCell align="center">Unit</TableCell>

                            <TableCell align="center">Size</TableCell>
                            <TableCell align="center">product Code</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Total</TableCell>

                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length && products?.map((product, index) => (
                            <TableRow>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell style={{textAlign:"center"}}>
                                <Avatar  alt='O' 
                                variant="square"
                                src="" 
                    //  src={`${webUrl}/uploads/products/${rowData.image}`} 
    
      />

                                </TableCell>
                                <TableCell align="center">{product?.type}</TableCell>
                                <TableCell align="center">{product?.category_name}</TableCell>
                                <TableCell align="center">{product?.unit_name}</TableCell>
                                <TableCell align="center">{product?.size_name}</TableCell>
                                <TableCell align="center">{product?.product_code}</TableCell>
                                <TableCell align="center">{product?.purchase_price}</TableCell>

                                <TableCell align="center">
                                    <TextField
                                        style={{ padding: "3px" }}
                                        variant="outlined"
                                        size="small"
                                        id="standard-number"
                                        type="number"
                                        value={product?.qty}
                                        onChange={(e) => handdleQuantityChange(product?.id, e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">{product?.qty * product?.purchase_price }</TableCell>
                                <TableCell align="center">
                                    <DeleteForeverIcon color="error" size="small" onClick={() => handdleproductRemove(product.id)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* <Dialog
open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">Do You Want To Delete Permanently</DialogTitle>

<DialogActions>
  <Button onClick={handleClose} color="primary">
   No
  </Button>
  <Button onClick={()=>handlePermaneltlyDelete()} color="primary" autoFocus>
   Yes
  </Button>
</DialogActions>
</Dialog> */}
        </>
    );
};

export default ProductTable;
