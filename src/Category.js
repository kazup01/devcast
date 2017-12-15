import React, { Component } from 'react'
import firebase,{auth} from './firebase.js'
import { Link } from 'react-router-dom'


class Category extends Component {
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

  componentDidMount(){
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
        <div>
          <Link to={'/'}>Back</Link>
        </div>

        <div>
          <h1>{this.props.match.params.category}</h1>
          <ul>
            {this.state.items.map((item) => {
              if(this.props.match.params.category === item.category){
                return(
                  <li key={item.id}>
                    <h3>{item.title}</h3>
                    <p>Category: {item.category}</p>
                    <div>brought by: {item.user}
                      {
                        item.user_id === this.state.user.uid
                        ?
                        <button onClick={() => this.removeItem(item.id)}>Remove item</button>
                        :
                        <p>Want a delete it? Please log in!</p>
                      }
                    </div>
                  </li>
                )
              }else{
                return(
                  <div></div>
                )
              }
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default Category