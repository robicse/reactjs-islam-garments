import React, { useState,useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import MoneyIcon from '@material-ui/icons/Money';
import { Button, CircularProgress, Grid } from '@material-ui/core';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import { baseUrl } from '../../const/api';
import axios from 'axios';
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import ShoppingCartRoundedIcon from '@material-ui/icons/ShoppingCartRounded';
import { useAsyncEffect } from 'use-async-effect';
import Gurd from 'components/guard/Gurd';
import { useRouter } from 'next/router';
 
const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    background:"#800080"
      // 'linear-gradient(0deg, rgba(0,46,121,1) 0%, rgba(22,77,167,1) 27%, rgba(86,150,255,1) 100%)',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const title = 'Dashboard';
const subject = 'Dashboard';

const Dashboard = observer(() => {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useRootStore();

  const [load, setLoad] = useState(false);




  const urlTodaySale = `${baseUrl}/today_sale`;



const fetchTotalPurchase = async() => {
  try {
    const todSale = await axios.get(urlTodaySale, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });

    console.log(todSale);
    // setTodaySale(todSale.data.response);
    
  } catch (error) {
    console.log(error);
  }

}

useEffect(()=>{
  fetchTotalPurchase()
},[])




  const router = useRouter();

  return (
    <div>

      <Gurd subject={subject}>
        <Grid container direction="row" justify="space-evenly" spacing={3}>

        
          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        1000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
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
                    alignItems="center">
                    <PeopleIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>



          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        100000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
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
                    alignItems="center">
                    <PeopleIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>



          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        100000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
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
                    alignItems="center">
                    <PeopleIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>

          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        100000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
                        Total Products
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
                    alignItems="center">
                    <ShoppingCartRoundedIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>


          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        100000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
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
                    alignItems="center">
                    <ShoppingCartRoundedIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>

          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        100000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
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
                    alignItems="center">
                    <MoneyIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>






          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        100000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
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
                    alignItems="center">
                    <ShoppingCartRoundedIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>

       

          <Grid item xs={12} md={3}>
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        100000
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
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
                    alignItems="center">
                    <ShoppingCartRoundedIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              </Card>
          </Grid>

       



                      
         
        </Grid>
      </Gurd>
    </div>
  );
});
export default Dashboard;
