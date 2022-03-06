import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import cogoToast from "cogo-toast";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import RefreshIcon from "@material-ui/icons/Refresh";
import Slide from "@material-ui/core/Slide";
import { Box, Chip, Grid } from "@material-ui/core";
import { baseUrl, webUrl } from "../../const/api";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import MuiAlert from "@material-ui/lab/Alert";
import Edit from "../../components/admin/product/edit";
import Create from "../../components/admin/product/create";
import tableIcons from "components/table_icon/icon";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";
import { useReactToPrint } from "react-to-print";
import Barcode from "components/admin/product/barcode.js";
import useStatePromise from "hooks/use-state-promise";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = "Product";
const subject = "Product";

const TableList = observer(() => {
  const classes = useStyles();
  const tableRef = React.createRef();
  const { user } = useRootStore();
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [invoiceData, setInvoicedata, setInvoicedataPromise] =
    useStatePromise(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);
  const [barcodeProduct, setbarcodeproduct] = useState(null);
  const [barcodeProductName, setbarcodeproductname] = useState(null);
  const [barcodeProductPrice, setbarcodeproductprice] = useState(null);
  const [vatStatus, setVatStatus] = useState(null);
  const [openImagePopUp, setproductImagePopUp] = useState(false);
  const [productImage, setproductImage] = useState(null);
  const [selectType, setSelectType] = useState("Own");

  const endpoint = {
    list: "product_list_with_search",
    createAPi: `${baseUrl}/product_create`,
    edit: "product_edit",
    delete: "product_delete",
    sizesUrl: `${baseUrl}/product_size_list`,
    unitUrl: `${baseUrl}/product_unit_list`,
    subunitUrl: `${baseUrl}/product_sub_unit_list`,
    categoryUrl: `${baseUrl}/product_category_list`,
    productDuplicateSearchUrl: `${baseUrl}/check_exists_product`,
    headers: { headers: { Authorization: "Bearer " + user.details.token } },
  };
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  const handleClickOpenEdit = () => {
    setOpenEditModal(true);
  };
  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const columns = [
    {
      title: "Front Image",
      render: (rowData) => (
        <Avatar
          alt="o"
          variant="square"
          src={`${webUrl}/uploads/products/${rowData?.front_image}`}
        />
      ),
    },
    {
      title: "Back Image",
      render: (rowData) => (
        <Avatar
          alt="o"
          variant="square"
          src={`${webUrl}/uploads/products/${rowData?.back_image}`}
        />
      ),
    },
    { title: "Type", field: "type" },
    {
      title: "Category",
      field: "category_name",
    },
    { title: "Unit", field: "unit_name" },
    { title: "Sub Unit", field: "sub_unit_name" },
    { title: "Size", field: "size_name" },
    {
      title: "Product Code",
      field: "product_code",
    },
    { title: "Name", field: "name" },
    { title: "Price", field: "purchase_price" },
    { title: "Color", field: "color" },
    { title: "Design", field: "design" },
    // {
    //   title: "Status",
    //   field: "status",
    //   render: (rowData) => (
    //     <Chip
    //       color={rowData.status ? "primary" : "secondary"}
    //       size="small"
    //       label={rowData.status ? "Active" : "Inactive"}
    //       icon={rowData.status ? <CheckCircleIcon /> : <ErrorIcon />}
    //     />
    //   ),
    // },
  ];

  const componentRef = React.useRef(null);

  const handlePrint = async (row) => {
    const state = await setInvoicedataPromise(row).then(() => {
      setbarcodeproduct(row.barcode);
      setbarcodeproductname(row.product_name);
      setbarcodeproductprice(row.selling_price);
      setVatStatus(row.vat_status);
    });
    if (handlePrintInvoice) {
      handlePrintInvoice();
    }
  };
  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });

  // handle edit
  const handleEdit = (row) => {
    if (!user.can("Edit", subject)) {
      cogoToast.error("You don't have Edit permission!", {
        position: "top-right",
        bar: { size: "10px" },
      });
      return null;
    }
    setEditData(row);
    setOpenEditModal(true);
  };

  // handle create
  const handleCreate = () => {
    if (!user.can("Create", subject)) {
      cogoToast.error("You don't  have Create permission!", {
        position: "top-right",
        bar: { size: "10px" },
      });
      return null;
    }
    handleClickOpenCreate(true);
  };

  // handle Delette
  const handleDelete = async (row_id) => {
    if (!user.can("Delete", subject)) {
      cogoToast.warn("You don't have permission!", {
        position: "top-right",
        bar: { size: "10px" },
      });
      return null;
    }

    try {
      await axios.post(
        `${baseUrl}/${endpoint.delete}`,
        {
          product_id: row_id,
        },
        endpoint.headers
      );
      cogoToast.success("Delete Success", {
        position: "top-right",
        bar: { size: "10px" },
      });
      handleRefress();
    } catch (error) {
      AllApplicationErrorNotification(error?.response?.data);
    }
  };

  // popup open

  const handleImagePopup = (img) => {
    setproductImage(img);
    setproductImagePopUp(true);
  };
  // popup close
  const handleImagePopUpClose = () => {
    setproductImagePopUp(!openImagePopUp);
  };

  const handleTypeChange = (typevale) => {
    setSelectType(typevale);
    handleRefress();
  };

  return (
    <Gurd subject={subject}>
      <div style={{ display: "none" }}>
        {/* <Barcode
          ref={componentRef}
          inv={invoiceData}
          barProd={barcodeProduct}
          barProdName={barcodeProductName}
          vatStatus={vatStatus}
          barProdPrice={barcodeProductPrice}
          invoiceProduct={invoiceProduct}
        /> */}
      </div>
  

      <Grid xs={12}>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={3} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>{title} List</h4>
                  </Box>
                </Grid>

                <Grid
                  container
                  item
                  xs={3}
                  spacing={3}
                  style={{ display: "flex" }}
                >
                  <p style={{ marginTop: "16px" }}>Own</p>
                  <Radio
                    checked={selectType === "Own"}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    value="Own"
                    name="radio-button-demo"
                    inputProps={{ "aria-label": "Own" }}
                    label="Type"
                  />
                  <p style={{ marginTop: "16px" }}>Buy</p>
                  <Radio
                    checked={selectType === "Buy"}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    value="Buy"
                    name="radio-button-demo"
                    inputProps={{ "aria-label": "Buy" }}
                  />

              
                </Grid>

                <Grid
                  container
                  item
                  xs={6}
                  spacing={3}
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                  >
                    Create {title}
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>

            <CardBody>
              <MaterialTable
                icons={tableIcons}
                title="List"
                tableRef={tableRef}
                columns={columns}
                data={(query) =>
                  new Promise((resolve, reject) => {
                    let url = `${baseUrl}/${endpoint.list}?type=${selectType}`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`;
                    }

                    url += `&page=${query.page + 1}`;
                    fetch(url, {
                      method: "post",
                      headers: { Authorization: "Bearer " + user.auth_token },
                    })
                      .then((resp) => resp.json())
                      .then((resp) => {
                        resolve({
                          data: resp?.data,
                          page: resp?.meta?.current_page - 1,
                          totalCount: resp?.meta?.total,
                        });
                      });
                  })
                }
                actions={[
                  // {
                  //   icon: () => (
                  //     <Button
                  //       fullWidth={true}
                  //       variant="contained"
                  //       color="primary"
                  //     >
                  //       <PrintTwoToneIcon fontSize="small" color="white" />
                  //     </Button>
                  //   ),
                  //   tooltip: "Barcode Print",
                  //   onClick: (event, rowData) => handlePrint(rowData),
                  // },
                  {
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="primary"
                      >
                        <ListAltTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Open Image",
                    onClick: (event, rowData) =>
                      handleImagePopup({
                        img1: rowData.front_image,
                        img2: rowData.front_image,
                      }),
                  },
                  {
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="primary"
                      >
                        <EditTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Edit Product",
                    onClick: (event, rowData) => handleEdit(rowData),
                  },
                  // (rowData) => ({
                  //   icon: () => (
                  //     <Button
                  //       fullWidth={true}
                  //       variant="contained"
                  //       color="secondary"
                  //     >
                  //       <DeleteForeverTwoToneIcon
                  //         fontSize="small"
                  //         color="white"
                  //       />
                  //     </Button>
                  //   ),
                  //   tooltip: "Delete Party",
                  //   onClick: (event, rowData) => (
                  //     confirm("You want to delete " + rowData.name),
                  //     handleDelete(rowData.id)
                  //   ),
                  // }),
                  {
                    icon: RefreshIcon,
                    tooltip: "Refresh Data",
                    isFreeAction: true,
                    onClick: () => handleRefress(),
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,

                  pageSize: 12,
                  pageSizeOptions: [12],

                  padding: "dense",
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Dialog
        fullScreen
        open={openCreateModal}
        onClose={handleCloseCreate}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseCreate}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" style={{ flex: 1 }}>
              Create {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Create
          token={user.auth_token}
          modal={setOpenCreateModal}
          endpoint={endpoint}
          mutate={handleRefress}
        />
      </Dialog>

      <Dialog
        open={openEditModal}
        onClose={handleCloseEdit}
        TransitionComponent={Transition}
        maxWidth="lg"
      >
        <AppBar style={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseEdit}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" style={{ flex: 1 }}>
              Edit {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Edit
          token={user.auth_token}
          modal={setOpenEditModal}
          editData={editData}
          endpoint={endpoint.edit}
          mutate={handleRefress}
        />
      </Dialog>

      <Dialog
        onClose={handleImagePopUpClose}
        aria-labelledby="customized-dialog-title"
        open={openImagePopUp}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleImagePopUpClose}
        >
          product Image
        </DialogTitle>
        <DialogContent dividers>
          <img
            src={`${webUrl}/uploads/products/${productImage?.img1}`}
            alt="mid"
            width="500"
            height="300"
          />
          <img
            src={`${webUrl}/uploads/products/${productImage?.img2}`}
            alt="mid"
            width="500"
            height="300"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleImagePopUpClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Gurd>
  );
});

export default TableList;
