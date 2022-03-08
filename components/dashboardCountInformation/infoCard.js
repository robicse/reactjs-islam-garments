import React from "react";
import Link from 'next/link'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const Card = (
  ({ link, backgroundColor,Icon,title,value}) => {
  

    return (
        <Link href={link}>
                <Card className={classes.root} style={{ cursor: 'pointer', backgroundColor:backgroundColor }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        {value}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: '#ffffff'  }}>
                        {title}
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
                    <Icon/>
                  </Grid>
                </Grid>
              </Card>
              </Link>
    );
  }
)

export default TableList;
