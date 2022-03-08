import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import tableIcons from "components/table_icon/icon";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import RefreshIcon from "@material-ui/icons/Refresh";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import MaterialTable from "material-table";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Grid, TextField } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AllApplicationErrorNotification from '../../components/utils/errorNotification';



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


const StoreStockComponent = observer(() => {
  const classes = useStyles();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };
  const { user } = useRootStore();

  console.log(user?.details?.store_id)
  const [storeId, setStoreId] = useState(user?.details?.store_id);
  const [storeList, setStoreList] = useState([]);


  const endpoint = {
  title:"Store Stock",
  activeStorelistApi: `${baseUrl}/store_active_list`,
  stockListApi: `${baseUrl}/store_current_stock_by_id`,
  stockInAPi: `${baseUrl}/store_stock_in`,
  stockInEditAPi: `${baseUrl}/store_stock_in_edit`,
  deleteAPi: `${baseUrl}/store_stock_in_delete`,
  headers: { headers: { Authorization: "Bearer " + user.details.token }}
};

const subject = "Store Stock";

console.log(user.role,'jjjj');

const storeListFetch = async()=>{
    try {
      const response =  await axios.get(endpoint.activeStorelistApi,endpoint.headers);
      console.log(response)
      setStoreList(response?.data?.data)
    } catch (error) {
        AllApplicationErrorNotification(error?.response?.data);
    }
  
  }
React.useEffect(()=>{
    storeListFetch()
},[])


 

  const columns = [
    { title: "Store", field: "store_name" },
    {
      title: "Type",
      field: "type",

    },
    // {
    //   title: "Product Name",
    //   field: "product_name",
    //   render: (rowData) => (
    //     <Typography variant="subtitle2" style={{ width: "250px" }}>
    //       {rowData.product_name}
    //     </Typography>
    //   ),
    // },
    { title: "Code", field: "product_code" },
    { title: "Category", field: "product_category_name" },
    { title: "Unit", field: "product_unit_name" },
    { title: "Size", field: "product_size_name" },
    { title: "Price(TK)", field: "purchase_price" },
    
    { title: "Stock", field: "current_stock" },
    
  ];

  return (
   <Gurd subject={subject}>
  
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>{endpoint.title}</h4>
             
                  </Box>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  spacing={3}
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                ></Grid>
              </Grid>
            </CardHeader>

            <FormControl
              variant="filled"
              className={classes.formControl}
              style={{ margin: "10px 15px" }}
            >
              <InputLabel id="demo-simple-select-filled-label">
              Store List
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={storeId}
                disabled={user?.role !== 'Super Admin'}
                onChange={(e) => {
                  setStoreId(e.target.value);
                  handleRefress();
                }}
              >
                {
                  storeList.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.store_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <CardBody>
  
                <MaterialTable
                  icons={tableIcons}
                  title={endpoint.title}
                  tableRef={tableRef}
                  columns={columns}
                  data={(query) =>
                    new Promise((resolve, reject) => {
                      let url = `${endpoint.stockListApi}?`;

                      let data = new FormData();
                      data.append("store_id", JSON.stringify(storeId));
                      const requestOptions = {
                        method: "POST",
                        headers: {
                          Authorization: "Bearer " + user.auth_token,
                        },
                        body: data,
                      };

                      //searching
                      if (query.search) {
                        url += `search=${query.search}`;
                      }

                      url += `&page=${query.page + 1}`;
                      url += "&store_id=" + storeId;
                      fetch(url, requestOptions)
                        .then((resp) => resp.json())
                        .then((resp) => {

                          if (resp.data) {
                            resolve({
                              data: resp?.data?.data,
                              page:
                                resp?.current_page - 1,
                               totalCount:
                               resp?.data?.total,
                            });
                          }else{
                            resolve({
                              data:[],
                              page:  0,
                              totalCount:0,
                        });
                          }
                        });
                    })
                  }
                  actions={[
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
          {/* <Dialog
            fullScreen
            open={openCreateModal}
            onClose={handleCloseCreate}
            TransitionComponent={Transition}>
            <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseCreate}
                  aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Transfer Stock
                </Typography>
              </Toolbar>
            </AppBar>
            <Create
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              mutate={mutate}
            />
          </Dialog> */}
        </GridItem>
      </GridContainer>
     </Gurd> 

  );
});

export default StoreStockComponent;
