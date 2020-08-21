// src/App.js
import React, { Component }  from 'react';

import { API, graphqlOperation, Auth } from 'aws-amplify'

import { listItems as ListItems } from './graphql/queries'
// import the mutation
import { createItem as CreateItem } from './graphql/mutations'

// src/App.js, import the new component
import { withAuthenticator, AmplifyAuthenticator } from '@aws-amplify/ui-react'

import ItemCard from './ItemCard'
import AppBar from './AppBar'






import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


class App extends Component {
  // define some state to hold the data returned from the API
  state = {
    name: '', category: '', description: '', items: []
  }

  // execute the query in componentDidMount
  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser()
    console.log('user:', user)
    console.log('user info:', user.signInUserSession.idToken.payload)
    try {
      const itemData = await API.graphql(graphqlOperation(ListItems))
      console.log('itemData:', itemData)
      this.setState({
        items: itemData.data.listItems.items
      })
    } catch (err) {
      console.log('error fetching items...', err)
    }
  }
  createItem = async() => {
    const { name, category, description } = this.state
    if (name === '' || category=='' || description === '') return

    const item = { name, category, description }
    const items = [...this.state.items, item]
    this.setState({
      items, name: '', category: '', description: ''
    })

    try {
      await API.graphql(graphqlOperation(CreateItem, { input: item }))
      console.log('item created!')
    } catch (err) {
      console.log('error creating item...', err)
    }
  }
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    return (
      <>
        <AppBar />
        <Card className={this.props.classes.root}>
            <CardContent>
        <input
          name='name'
          onChange={this.onChange}
          value={this.state.name}
          placeholder='item'
        />
        <input
          name='category'
          onChange={this.onChange}
          value={this.state.catgeory}
          placeholder='recipient'
        />
        <input
          name='description'
          onChange={this.onChange}
          value={this.state.description}
          placeholder='notes'
        />
        <button onClick={this.createItem}>Add Item</button>
        </CardContent>
<CardActions>
  <Button size="small">Learn More</Button>
</CardActions>
</Card>
        {
          this.state.items.map((item, index) => <ItemCard key={index} name={item.name} category={item.category} description={item.description} />
          )
        }
      </>
    )
  }
}

//export default withAuthenticator(App)


export default () => {
  const classes = useStyles();
  return (
    <AmplifyAuthenticator>
      <App classes = {classes}/>
    </AmplifyAuthenticator>
  )
}
  