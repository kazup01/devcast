import React, { Component } from 'react'
import firebase, { auth, googleProvider, twitterProvider } from './firebase.js'
import { Link } from 'react-router-dom'
// import './Dashboard.css'

class Dashboard extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      uid: '',
      category: '',
      items: [],
      user: null
    }
    this.logout = this.logout.bind(this)
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

  //ログアウト
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        })
        this.props.history.push('/')
      })
  }

  render(){
    return(
      <div>
        {this.state.user ?
        <div>
          <div>
            <p><Link to={`/`}>Back</Link></p>
            <p>Welcome to {this.props.match.params.name}</p>
          </div>

          <div>
            <img src={this.state.user.photoURL} />
            <p>displayName: {this.state.user.displayName}</p>
            <p>Email: {this.state.user.email}</p>
            <p>UID: {this.state.user.uid}</p>

            <button onClick={this.logout}>Logout</button>
          </div>

          <div>
            <ul>
              {this.state.items.map((item) => {
                if(item.user_id === this.state.user.uid){
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

export default Dashboard