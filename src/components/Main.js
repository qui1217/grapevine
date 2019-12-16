// =============================
// DEPENDENCIES
// =============================
// packages
import React from 'react'

// components
import Post from './Post.js'
import Form from './Form.js'

// =============================
// COMPONENT CLASS
// =============================
let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:8888'
} else {
  baseUrl = 'https://grapevine-backend-php.herokuapp.com'
}

class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      posts: []
    }
  }

  fetchPosts = () => {
    fetch(`${baseUrl}/posts`)
    .then(data => data.json())
    .then(jData => {
      this.setState({posts:jData})
    }).catch(err=>console.log(err))
  }

  handleCreate = (createData) => {
    fetch(`${baseUrl}/posts`, {
      body: JSON.stringify(createData),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(createdPost => {
      return createdPost.json()
    })
    .then(jsonedPost => {
      this.props.handleView('home')
      this.setState(prevState => {
        prevState.posts = jsonedPost
        return { posts: prevState.posts }
      })
    })
    .catch(err=>console.log(err))
  }

  handleUpdate = (updateData) => {
    fetch(`${baseUrl}/posts/${updateData.id}`, {
      body: JSON.stringify(updateData),
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(updatedPost => {
      this.props.handleView('home')
      this.fetchPosts()
    })
    .catch(err=>console.log(err))
  }

  handleDelete = (id) => {
    fetch(`${baseUrl}/posts/${id}` , {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }})
    .then(json => {
      this.setState({
        // const posts = prevState.posts.filter(post=> post.id !==  id)
        posts: this.state.posts.filter(post=>post.id !== id)
        // return {posts}
      })
    })
    .catch(err=>console.log(err))
  }

  componentDidMount(){
    this.fetchPosts()
  }



  // ==============
  // RENDER
  // ==============
  render () {
    return (
      <main>
        <h1>{this.props.view.pageTitle}</h1>

        { this.props.view.page === 'home'
          ? this.state.posts.map((postData) => (
            <Post
              key={postData.id}
              postData={postData}
              handleView={this.props.handleView}
              handleDelete={this.handleDelete}
            />
          ))
          : <Form
              handleCreate={this.handleCreate}
              handleUpdate={this.handleUpdate}
              formInputs={this.props.formInputs}
              view={this.props.view}
            />
        }
      </main>
    )
  }
}

// =============================
// EXPORT
// =============================
export default Main
