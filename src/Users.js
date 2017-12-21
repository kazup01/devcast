import React, { Component } from 'react'
import firebase, {auth} from './firebase.js'
import { Link } from 'react-router-dom'

class Users extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      uid: '',
      category: '',
      items: [],
      user: null
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      } 
    })

    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          user_id: items[item].user_id,
          category: items[item].category
        });
      }
      this.setState({
        items: newState
      })
    })
  }

  render(){
    return(
      <div>
      {this.state.user ?
        <div>
        <div>
          <p><Link to={`/`}>Back</Link></p>
          <p>Note list of {this.props.match.params.name}</p>
        </div>

        <div>
          <ul>
            {this.state.items.map((item) => {
              if(this.props.match.params.name === item.user){
                return (
                  <li key={item.id}>
                    <h3>{item.title}</h3>
                    <p>User ID: {item.user_id}</p>
                    <p>Category: {item.category}</p>
                    <div>brought by: {item.user}
                      {
                        item.user_id === this.state.user.uid
                      ?
                        <button onClick={() => this.removeItem(item.id)}>Remove Item</button> 
                      : 
                        <p className='remove-alert'>Would you remove this post? You need to log in this users.</p>
                      }
                    </div>
                  </li>
                )
              }else{
                return (
                  <div></div>
                )
              }

            })}
          </ul>
        </div>
      </div>
      :
      <div></div> 
      }

      </div>
    )
  }
}

export default Users