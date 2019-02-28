import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as PostsAPI from '../utils/api/posts'
import * as CommentsAPI from '../utils/api/comments'
import { getCommentsForPost } from '../actions/comments'

const testID = "8xf0y6ziyjabvozdd253nd"

class PostDetail extends Component {

  state = {
    post: {},
    comments: {},
  }

  componentDidMount = () => {
    const { loadPost, loadComments } = this.props

    loadPost(testID)
      .then((post) => this.setState((prevState) => ({
        ...prevState,
        post
      })))

    loadComments(testID)
      // .then((comments) => this.setState((prevState) => ({
      //   ...prevState,
      //   comments,
      // })))
      .then((comments) => this.props.getComments(comments))
  }

  handlePostVote = (e) => {
    e.preventDefault()
    const vote = e.target.name
    console.log('Voted: ', vote)
    // TODO: can only once once per session/post.
    PostsAPI.votePost(testID, vote)
      .then(() => this.setState((prevState) => ({ // since using API and not Redux, gotta update local state
        ...prevState,
        post: {
          ...prevState.post,
          voteScore: vote === 'upVote'
                      ? prevState.post.voteScore + 1
                      : prevState.post.voteScore - 1,
        }
      })))
      // .then((post) => this.props.dispatch()) // if use Redux instead!
  }

  handleCommentVote = (e) => {
    e.preventDefault()
    const vote = e.target.name
    console.log('Voted: ', vote)
    // vote === 'upVote' ? :
  }

  render(){
    const { post } = this.state
    const { comments } = this.props
    return (
      <div>
        {
          post === {}
            ? null
            : (
              <div>
                <h1>Post Detail</h1>
                <h2>{post.title || 'Title'}</h2>
                <h3>By {post.author || 'Author'} on {post.timestamp || 'Date'}, Category: {post.category || 'Category'}</h3>
                {/* TODO: Icon for voting up/down */}
                <button onClick={this.handlePostVote} name='upVote'>Vote Up</button>
                <button onClick={this.handlePostVote} name='downVote'>Vote Down</button>
                <p>Vote Score: {post.voteScore}</p>

                <p>{post.body}</p>

                <button>Edit this Post</button>
                <br></br>
                <br></br>

                {
                  comments.length === 0
                    ? <p>No Comments for this Post</p>
                    : (
                      <div>
                        <h3>{post.commentCount} comments</h3>
                        {
                          Object.values(comments).map(comment => (
                            <div key={comment.id}>
                               <div>Author: {comment.author}</div>
                               <div>Body: {comment.body}</div>
                               <button onClick={this.handleClick} name='upVote'>Vote Up</button>
                               <button onClick={this.handleClick} name='downVote'>Vote Down</button>
                               <p>Vote Score: {comment.voteScore}</p>
                               <br></br>
                            </div>
                          ))
                        }
                        <br></br>

                        <button>Add Comment</button>
                      </div>
                    )
                }

              </div>
            )
        }
      </div>
    )
  }
}

function mapStateToProps({ posts, comments }) {
  console.log('posts: ', Object.values(posts))
  // console.log('comments: ', Object.values(comments))
  console.log('comments: ', comments) // -> is still empty!
  // TODO: need to get comments per post!! use API here!!
  const post = Object.values(posts).filter(post => post.id === testID)[0]
  // const comments = Object.values(comments).filter(comment => comment.parentId === testID)
  console.log('post: ', post)
  return {
    post,
    comments,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // use API to get post instead of mapStateToProps, because get comments count automatically!
    loadPost: (id) => PostsAPI.getPost(id),
    loadComments: (id) => CommentsAPI.getCommentsForPost(id),
    getComments: (comments) => dispatch(getCommentsForPost(comments))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail)
