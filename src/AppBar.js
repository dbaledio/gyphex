import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { AmplifySignOut } from '@aws-amplify/ui-react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBarSpacer: {
    marginRight: theme.spacing(2),
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Gyphex
          </Typography>
          <div className={classes.appBarSpacer}>
          </div>
          <AmplifySignOut />
        </Toolbar>
      </AppBar>
    </div>
  );
}
