// src/App.js
import React from 'react';

import { API, graphqlOperation, Auth } from 'aws-amplify'

import { listItems as ListItems } from './graphql/queries'
// import the mutation
import { createItem as CreateItem } from './graphql/mutations'

// src/App.js, import the new component
import { withAuthenticator } from 'aws-amplify-react'

class App extends React.Component {
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
        <input
          name='name'
          onChange={this.onChange}
          value={this.state.name}
          placeholder='iteme'
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
        {
          this.state.items.map((item, index) => (
            <div key={index}>
              <h3>{item.name}</h3>
              <h5>{item.category}</h5>
              <p>{item.description}</p>
            </div>
          ))
        }
      </>
    )
  }
}

export default withAuthenticator(App, { includeGreetings: true })