import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBarSpacer: {
    marginRight: theme.spacing(2),
    flexGrow: 1,
  },
}));


async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Button variant="contained" color="primary" disableElevation>
            Go Back
          </Button>
          <div className={classes.appBarSpacer}>
          </div>
          <AmplifySignOut />
        </Toolbar>
      </AppBar>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default withAuthenticator(App, true);