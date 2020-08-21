// src/App.js
import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listItems as ListItems } from './graphql/queries';
// import the mutation
import { createItem as CreateItem } from './graphql/mutations';
// src/App.js, import the new component
import { withAuthenticator, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import AppBar from './AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Input,
  Grid,
} from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  pos: {
    marginBottom: 12,
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    height: "100%",

  },
  form: {
    flexGrow: 1,
    padding: theme.spacing(2),
    textAlign:'center'
   },
}));

class App extends Component {
  // define some state to hold the data returned from the API
  state = {
    name: '',
    category: '',
    description: '',
    items: [],
  };

  // execute the query in componentDidMount
  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();
    console.log('user:', user);
    console.log('user info:', user.signInUserSession.idToken.payload);
    try {
      const itemData = await API.graphql(graphqlOperation(ListItems));
      console.log('itemData:', itemData);
      this.setState({
        items: itemData.data.listItems.items,
      });
    } catch (err) {
      console.log('error fetching items...', err);
    }
  }
  createItem = async () => {
    const { name, category, description } = this.state;
    if (name === '' || category == '' || description === '') return;

    const item = { name, category, description };
    const items = [...this.state.items, item];
    this.setState({
      items,
      name: '',
      category: '',
      description: '',
    });

    try {
      await API.graphql(graphqlOperation(CreateItem, { input: item }));
      console.log('item created!');
    } catch (err) {
      console.log('error creating item...', err);
    }
  };
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    return (
      <>
        <AppBar />
        <div className={this.props.classes.root}>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
        >
          <Grid item xs={12} sm={6} md={3}>
            <Card className={this.props.classes.form}>
              <CardContent                   >
                <form
                  noValidate
                  autoComplete='off'
                >
                  <Input
                    required
                    name='name'
                    onChange={this.onChange}
                    value={this.state.name}
                    placeholder='item'
                    fullWidth='true'
                  />
                  <br></br>
                  <Input
                    required
                    name='category'
                    onChange={this.onChange}
                    value={this.state.catgeory}
                    placeholder='recipient'
                    fullWidth='true'
                  />
                  <br></br>
                  <Input
                    required
                    name='description'
                    onChange={this.onChange}
                    value={this.state.description}
                    placeholder='notes'
                    fullWidth='true'
                  />
                  <br></br>
                </form>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.createItem}
                  fullWidth='true'
                  disableElevation
                >
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {this.state.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className={this.props.classes.form}>
                <CardContent>
                  <Typography variant='h5' component='h2'>
                    {item.name}
                  </Typography>
                  <Typography
                    className={this.props.classes.pos}
                    color='textSecondary'
                  >
                    {item.category}
                  </Typography>
                  <Typography variant='body2' component='p'>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </div>
      </>
    );
  }
}

export default () => {
  const classes = useStyles();
  return (
    <AmplifyAuthenticator>
      <App classes={classes} />
    </AmplifyAuthenticator>
  );
};
