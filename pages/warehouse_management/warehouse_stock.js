import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import tableIcons from "components/table_icon/icon";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "components/guard/Gurd";
import RefreshIcon from "@material-ui/icons/Refresh";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import { Box, Grid } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AllApplicationErrorNotification from "components/utils/errorNotification";

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


const WarehouseStock = observer(() => {
  const classes = useStyles();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };
  const { user,role } = useRootStore();
  const [warehouseId, setWarehouseId] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);

  const endpoint = {
    title: "Warehouse Stock",
    subject: "Warehouse Stock",
    warehouseActiveListUrl: `${baseUrl}/warehouse_active_list`,
    stockListApi: `${baseUrl}/warehouse_current_stock_by_id`,
    headers: { headers: { Authorization: "Bearer " + user.details.token } },
  };

  //warehouse active list fetch


  console.log(user.role,role)

  const warehouseListFetch = async () => {
    try {
      const response = await axios.get(
        endpoint.warehouseActiveListUrl,
        endpoint.headers
      );
      setWarehouseList(response?.data?.data);
    } catch (error) {
      AllApplicationErrorNotification(error?.response?.data);
    }
  };
  React.useEffect(() => {
    warehouseListFetch();
  }, []);

  const columns = [
    {
      title: "Warehouse",
      field: "warehouse_name",
    },
    {
      title: "Type",
      field: "type",

    },
    { title: "Code", field: "product_code" },
    { title: "Category", field: "product_category_name" },
    { title: "Unit", field: "product_unit_name" },
    { title: "Size", field: "product_size_name" },
    { title: "Price(TK)", field: "purchase_price" },
    
    { title: "Stock", field: "current_stock" },
  ];

  return (
    // <Gurd subject={endpoint.subject}>
    <div>
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
              </Grid>
            </CardHeader>

            <FormControl
              variant="filled"
              className={classes.formControl}
              style={{ margin: "10px 15px" }}
            >
              <InputLabel id="demo-simple-select-filled-label">
                Warehouse List
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                onChange={(e) => {
                  setWarehouseId(e.target.value);
                  handleRefress();
                }}
              >
                {warehouseList.map((war) => (
                  <MenuItem key={war.id} value={war.id}>
                    {war.name}
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
                    data.append("warehouse_id", JSON.stringify(warehouseId));
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
                    url += "&warehouse_id=" + warehouseId;
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
        </GridItem>
      </GridContainer>
      {/* </Gurd> */}
    </div>
  );
});

export default WarehouseStock;
