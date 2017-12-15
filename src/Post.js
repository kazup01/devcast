import React, { Component } from 'react'
import firebase, { auth } from './firebase.js'
import { Link } from 'react-router-dom'

class Post extends Component {
  constructor(){
    super()
    this.state = {
      itemCategory: '',
      currentItem: '',
      itemContent: '',
      username: '',
      uid: '',
      items: [],
      user: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      } 
    })
  }

  //投稿処理
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items')
    const item = {
      title: this.state.currentItem,
      content: this.state.itemContent,
      category: this.state.itemCategory,
      user: this.state.user.displayName || this.state.user.email,
      user_id: this.state.user.uid
    }
    itemsRef.push(item)
    .then((res) => {
      this.props.history.push('/')
    })

    this.setState({
      itemCategory: '',
      currentItem: '',
      itemContent: '',
      username: '',
      uid: '',
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <p>Post here</p>
        {this.state.user ?
          <div className="submit-form">
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="username" defaultValue={this.state.user.displayName || this.state.user.email} required />
              <input type="text" name="username" defaultValue={this.state.user.uid} required />
              <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} required />
              <textarea type="text" name="itemContent" placeholder="Content here" onChange={this.handleChange} value={this.state.itemContent} required />
              <input type="text" name="itemCategory" placeholder="Category" onChange={this.handleChange} value={this.state.itemCategory} />
              <button>Post</button>
            </form>
          </div>
          :
          <div>
            <h2>You must be logged in to see the potluck list and submit to it.</h2>
          </div>
        }
      </div>
    )
  }
}

export default Post