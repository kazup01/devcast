import React, { Component } from 'react'
import firebase, { auth, googleProvider, twitterProvider } from './firebase.js'
import './Home.css'
import { Link } from 'react-router-dom'

class Home extends Component {

  constructor() {
    super()
    this.state = {
      itemCategory: '',
      currentItem: '',
      username: '',
      uid: '',
      items: [],
      user: null,
    }

    this.googleLogin = this.googleLogin.bind(this)
    this.twitterLogin = this.twitterLogin.bind(this)
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
          category: items[item].category
        });
      }
      this.setState({
        items: newState
      })
    })
  }

  //メール新規登録
  handleEmailRegisterSubmit(e) {
    e.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value

    firebase.auth().createUserWithEmailAndPassword(email, password)

    .catch(function(error) {
      alert('重複ユーザーです')
    })

  }

  //メールログイン
  handleEmailSignInSubmit(e) {
    e.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value

    firebase.auth().signInWithEmailAndPassword(email, password)
  }

  //Google ログイン
  googleLogin() {
    auth.signInWithPopup(googleProvider) 
      .then((result) => {
        const user = result.user
        this.setState({
          user
        })
      })
  }

  //twitterログイン
  twitterLogin() {
    auth.signInWithPopup(twitterProvider)
      .then((result) => {
        const token = result.credential.accessToken
        const secret = result.credential.secret
        const user = result.user
        this.setState({
          user
        })
      })
  }

  render() {
    return (
      <div>
        <div style={{position: 'absolute', right: '20px'}}>
          {this.state.user ?
            <div>
              <Link to={`/post`}>Post</Link>
              <br />
              <Link to={`/d/${this.state.user.displayName}`}>{this.state.user.displayName}</Link>
            </div>
          :
          <div>
            <button onClick={this.googleLogin}>Google Login</button>
            <button onClick={this.twitterLogin}>Twitter Login</button>
          </div>
          }
        </div>

        <div>
            <div className="top-wrap">
              <div className="top-category">
                <h1>Category</h1>
                {/* 投稿の数だけ表示されてしまうので、重複防止を噛ませる */}
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <Link to={`/c/${item.category}`}>{item.category}</Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="top-list">
                <h1>Post list</h1>
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3><Link to={`${item.user}/${item.title}`}>{item.title}</Link></h3>
                        <p>Category: {item.category}</p>
                        <p>brought by: {item.user}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default Home