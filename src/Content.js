import React, { Component } from 'react'
import firebase, { auth } from './firebase.js'
import { Link } from 'react-router-dom'

class Content extends Component {
  constructor() {
    super()
    this.state = {
      items: [],
      uid: '',
      itemCategory: '',
      currentItem: '',
      contentItem: ''
      //WIPコメント描画
      // comment: '',
      // comments: []
    }
    this.updateItem = this.updateItem.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.commentSubmit = this.commentSubmit.bind(this)
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      } 
    })

    const itemsRef  = firebase.database().ref('items')
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val()
      let newState = []
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          user_id: items[item].user_id,
          category: items[item].category,
          content: items[item].content
        })
      }
      this.setState({
        items: newState
      })
    })

    //WIPコメント描画
    // const commentsRef = firebase.database().ref('comments')
    // commentsRef.on('value', (snapshot) => {
    //   let comments = snapshot.val()
    //   let newState = []
    //   for (let comment in comments) {
    //     newState.push({
    //       id: comment,
    //       comment: comments[comment].comment,
    //     })
    //   }
    //   this.setState({
    //     comments: newState
    //   })
    // })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //アップデート
  updateItem(itemId) {
    const itemsRef = firebase.database().ref(`/items/${itemId}`)
    const item = {
      title: this.state.currentItem,
      content: this.state.contentItem
    }
    itemsRef.update(item)
    .then((res) => {
      this.props.history.push('/')
    })
    console.log('update!')
  }

  //削除
  removeItem(itemId) {
    // const itemRef = firebase.database().ref(`/items/${itemId}`)
    // itemRef.remove()
    firebase.database().ref(`/items/${itemId}`).remove()
  }

  //コメント
  commentSubmit(itemId){
    const commentsRef = firebase.database().ref(`/items/${itemId}/comment`)
    const comment = {
      comment: this.state.comment,
      user: this.state.user.displayName || this.state.user.email,
      user_id: this.state.user.uid 
    }
    commentsRef.push(comment)
    this.setState({
      comment: '',
      username: '',
      uid: ''
    })
  }

  render() {
    return (
      <div>
        <Link to={`/`}>Back</Link>
        <h1>Content</h1>
        <ul>
          {this.state.items.map((item) => {
            if(this.props.match.params.title === item.title){
              return (
                <li key={item.id}>
                  <h3>{item.title}</h3>
                  <p>Content: {item.content}</p>
                  {item.user_id === this.state.user.uid ?
                    <p>User ID: {item.user_id}</p>
                  :
                    ''
                  }
                  <p>Category: {item.category}</p>
                  <p>User: {item.user}</p>
                  <div>
                  {this.state.user ?
                    <div>
                      {
                        item.user_id === this.state.user.uid
                        ?
                        <div>
                          {this.state.mode === 'editNote' ?
                          <div>
                            <form onSubmit={() => this.updateItem(item.id)}>
                              <input type="text" name="currentItem" placeholder="Update?" defaultValue={item.title} onChange={this.handleChange} />
                              <textarea type="text" name="contentItem" placeholder="Update?" defaultValue={item.content} onChange={this.handleChange} />
                              <button>Update</button>
                            </form>
                          </div>
                          :
                          <div>
                            <button onClick={(e) => this.setState({
                              mode: 'editNote'
                            })}>Edit</button>
                          </div>
                          }
                          <div>
                            <input type="text" name="comment" placeholder="comment" onChange={this.handleChange} />
                            <button onClick={() => this.commentSubmit(item.id)}>submit</button>
                          </div>
                          <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                        </div>
                        :
                          <div>
                            {this.state.user ?
                              <div>
                              <input type="text" name="comment" placeholder="comment" onChange={this.handleChange} />
                                <button onClick={() => this.commentSubmit(item.id)}>submit</button>
                              </div>
                            :
                              ''
                            }
                            <p className='remove-alert'>Would you remove this post? You need to log in this users.</p>
                          </div>
                        }
                      </div>
                    :
                    <div>
                      <hr />
                      <p>Want you to comment? Let's sign up or sign in!</p>
                    </div>
                  }
                  </div>
                </li>
              )
            } else {
              <p>やっほー！</p>
            }

          })}
        </ul>
      </div>
    )
  }
}

export default Content