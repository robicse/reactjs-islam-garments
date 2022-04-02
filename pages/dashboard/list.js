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
  console.log("dataresponse", data?.response);
  // console.log("role", user?.details?.role);

  console.log(data);

  const router = useRouter();

  return (
    <div>
      <Gurd subject={subject}>
        {user?.details?.role === "Super Admin" && (
          <Grid container direction="row" justify="space-evenly" spacing={3}>
            <Grid item xs={12} md={3}>
              <InfoCard
                link="/supplier/list"
                iconData={
                  <PeopleIcon style={{ color: "#ffffff", fontSize: 65 }} />
                }
                backgroundColor="#3399FF"
                title="Total Supplier"
                value={data?.response?.totalSupplier}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/whole_sale_customer/list"
                iconData={
                  <PeopleIcon style={{ color: "#ffffff", fontSize: 65 }} />
                }
                backgroundColor="#321FDB"
                title="Total Customer"
                value={data?.response?.totalCustomer}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/whole_sale_customer/list"
                iconData={
                  <PeopleIcon style={{ color: "#ffffff", fontSize: 65 }} />
                }
                backgroundColor="#F9B115"
                title="Total Staff"
                value={data?.response?.totalStaff}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/warehouse_management/warehouse_stock_in"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#E55353"
                title="Today Purchase"
                value={data?.response?.todayPurchase}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/warehouse_management/warehouse_stock_in"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#4875B4"
                title="Total Purchase"
                value={data?.response?.totalPurchase}
              />
            </Grid>


            <Grid item xs={12} md={3}>
              <InfoCard
                link="/warehouse_management/warehouse_stock_in"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#E55353"
                title="Today Cash Pur"
                value={data?.response?.todayCashPurchase}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/warehouse_management/warehouse_stock_in"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#4875B4"
                title="Total Cash Pur"
                value={data?.response?.totalCashPurchase}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/warehouse_management/warehouse_stock"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#2EB85C"
                title=" WH Stock"
                value={data?.response?.warehouseTotalCurrentStock}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/warehouse_management/warehouse_stock"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#84995c"
                title="WH Amount"
                value={data?.response?.warehouseTotalCurrentStockAmount}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/store_management/store_stock"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#55bac9"
                title="Store Stock"
                value={data?.response?.storeTotalCurrentStock}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/store_management/store_stock"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#967963"
                title="Store Amount"
                value={data?.response?.storeTotalCurrentStockAmount}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/sale_management/whole_sale"
                iconData={
                  <ShoppingCartRoundedIcon
                    style={{ color: "#ffffff", fontSize: 65 }}
                  />
                }
                backgroundColor="#266915"
                title="Today Sale"
                value={data?.response?.todaySale}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/sale_management/whole_sale"
                iconData={
                  <MoneyIcon style={{ color: "#ffffff", fontSize: 65 }} />
                }
                backgroundColor="#156969"
                title="Total Sale"
                value={data?.response?.totalSale}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InfoCard
                link="/sale_management/whole_sale"
                iconData={
                  <MoneyIcon style={{ color: "#ffffff", fontSize: 65 }} />
                }
                backgroundColor="#156969"
                title="Total Cash Sale"
                value={data?.response?.totalCashSale}
              />
            </Grid>


            <Grid item xs={12} md={3}>
              <InfoCard
                link="/sale_management/whole_sale"
                iconData={
                  <MoneyIcon style={{ color: "#ffffff", fontSize: 65 }} />
                }
                backgroundColor="#156969"
                title="Today Cash Sale"
                value={data?.response?.todayCashSale}
              />
            </Grid>


          </Grid>
        )}

        <Grid item xs={12} md={12}>
          <InfoTable
            warehouseWiseInformation={data?.response?.warehouseWiseInformation}
            storeWiseInformation={data?.response?.storeWiseInformation}
          />
        </Grid>
      </Gurd>
    </div>
  );
});
export default Dashboard;
