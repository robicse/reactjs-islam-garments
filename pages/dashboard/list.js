import React, { useState, useEffect } from "react";
import Link from "next/link";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PeopleIcon from "@material-ui/icons/People";
import MoneyIcon from "@material-ui/icons/Money";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import { baseUrl } from "../../const/api";
import axios from "axios";
import ArrowRightAltRoundedIcon from "@material-ui/icons/ArrowRightAltRounded";
import ShoppingCartRoundedIcon from "@material-ui/icons/ShoppingCartRounded";
import { useAsyncEffect } from "use-async-effect";
import Gurd from "components/guard/Gurd";
import { useRouter } from "next/router";
import useSWR from "swr";
import InfoTable from "components/dashboardCountInformation/infoTable";
import InfoCard from "components/dashboardCountInformation/infoCard";

const useStyles = makeStyles((theme) => ({
  root: {
    // background: 'linear-gradient(180deg, #FFFFFF 0%, #000000 100%), linear-gradient(90deg, #FFFFFF 0%, #000000 100%), #00FFFF'
    // display: "flex",
    //  background:"#800080"
    // background 'linear-gradient(0deg, rgba(0,46,121,1) 0%, rgba(22,77,167,1) 27%, rgba(86,150,255,1) 100%)',
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const title = "Dashboard";
const subject = "Dashboard";

const Dashboard = observer(() => {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useRootStore();
  // const [totalSupplier, setTotalSupplier] = useState(0);
  // const [totalCustomer, setTotalCustomer] = useState(0);
  // const [totalStaff, setTotalStaff] = useState(0);

  // const endpoint = {
  //   totalSupplierurl: `${baseUrl}/total_supplier`,
  //   totalCustomerUrl: `${baseUrl}/total_customer`,
  //   totalStafUrl: `${baseUrl}/total_staff`,
  //   headers: { headers: {
  //     Authorization: "Bearer " + user.details.token,
  //     'Content-type': 'application/javascript'

  //   }},

  // };

  // fetch data
  // const fetchfunction = async(totalSupplierurl) => {
  //   try {
  //     const todSale = await axios.get(totalSupplierurl,endpoint.headers)
  //      return todSale
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

  // laod data
  // useEffect(()=>{
  //   const  totalSupplierRes = fetchfunction(endpoint.totalSupplierurl)
  //   const  totalCustomerRes = fetchfunction(endpoint.totalCustomerUrl)
  //   const  totalStaffRes = fetchfunction(endpoint.totalStafUrl)
  //   setTotalSupplier(totalSupplierRes)
  //   setTotalCustomer(totalCustomerRes)
  //   setTotalStaff(totalStaffRes)
  // },[])

  const fetcher = (url, auth) =>
    axios
      .get(url, {
        headers: { Authorization: "Bearer " + auth },
      })
      .then((res) => res.data);

  const url = `${baseUrl}/dashboard_count_information`;
  const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);
  // console.log('data',data)
  // console.log('dataresponse',data?.response?.storeTotalCurrentStock)
  console.log("role", user?.details?.role);

  const router = useRouter();

  return (
    <div>
      <Gurd subject={subject}>
        <Grid container direction="row" justify="space-evenly" spacing={3}>
          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/supplier/list">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#3399FF" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.totalSupplier}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          Total Supplier
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <PeopleIcon style={{ color: "#ffffff", fontSize: 65 }} />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/whole_sale_customer/list">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#321FDB" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.totalCustomer}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          Total Customer
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <PeopleIcon style={{ color: "#ffffff", fontSize: 65 }} />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Card
                className={classes.root}
                style={{ cursor: "pointer", backgroundColor: "#F9B115" }}
              >
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: "700", color: "#ffffff" }}
                      >
                        {data?.response?.totalStaff}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: "#ffffff" }}
                      >
                        Total Staff
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    md={4}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <PeopleIcon style={{ color: "#ffffff", fontSize: 65 }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/warehouse_management/warehouse_stock_in">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#E55353" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.todayPurchase}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          Today Purchase
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <ShoppingCartRoundedIcon
                        style={{ color: "#ffffff", fontSize: 65 }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/warehouse_management/warehouse_stock_in">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#4875B4" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.totalPurchase}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          Total Purchase
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <ShoppingCartRoundedIcon
                        style={{ color: "#ffffff", fontSize: 65 }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/warehouse_management/warehouse_stock">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#2EB85C" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.warehouseTotalCurrentStock}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          WH Stock
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <ShoppingCartRoundedIcon
                        style={{ color: "#ffffff", fontSize: 65 }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Card
                className={classes.root}
                style={{ cursor: "pointer", backgroundColor: "#84995c" }}
              >
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: "700", color: "#ffffff" }}
                      >
                        {data?.response?.warehouseTotalCurrentStockAmount}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: "#ffffff" }}
                      >
                        WH Amount
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    md={4}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <ShoppingCartRoundedIcon
                      style={{ color: "#ffffff", fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/store_management/store_stock">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#55bac9" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.storeTotalCurrentStock}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          Store Stock
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <ShoppingCartRoundedIcon
                        style={{ color: "#ffffff", fontSize: 65 }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Card
                className={classes.root}
                style={{ cursor: "pointer", backgroundColor: "#967963" }}
              >
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: "700", color: "#ffffff" }}
                      >
                        {data?.response?.storeTotalCurrentStockAmount}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: "#ffffff" }}
                      >
                        Store Amount
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    md={4}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <ShoppingCartRoundedIcon
                      style={{ color: "#ffffff", fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/sale_management/whole_sale">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#266915" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.todaySale}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          Today Sale
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <ShoppingCartRoundedIcon
                        style={{ color: "#ffffff", fontSize: 65 }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          {user?.details?.role === "Super Admin" ? (
            <Grid item xs={12} md={3}>
              <Link href="/sale_management/whole_sale">
                <Card
                  className={classes.root}
                  style={{ cursor: "pointer", backgroundColor: "#156969" }}
                >
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <CardContent>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{ fontWeight: "700", color: "#ffffff" }}
                        >
                          {data?.response?.totalSale}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ color: "#ffffff" }}
                        >
                          Total Sale
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      md={4}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    >
                      <MoneyIcon style={{ color: "#ffffff", fontSize: 65 }} />
                    </Grid>
                  </Grid>
                </Card>
              </Link>
            </Grid>
          ) : (
            ""
          )}

          <Grid item xs={12} md={3}>
            <InfoCard
              link="/sale_management/whole_sale"
              iconData={
                <MoneyIcon style={{ color: "#ffffff", fontSize: 65 }} />
              }
              backgroundColor="#156969"
              title="Test"
              value="00"
            />
          </Grid>




          <Grid item xs={12} md={12}>
            <InfoTable
              warehouseWiseInformation={
                data?.response?.warehouseWiseInformation
              }
              storeWiseInformation={data?.response?.storeWiseInformation}
            />
          </Grid>
        </Grid>
      </Gurd>
    </div>
  );
});
export default Dashboard;
