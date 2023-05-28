import React from "react";
import { useEffect, useCallback } from 'react'
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useParams } from "react-router-dom";
import axios from '../axios';
import styles from "./AddComment.module.scss";
import { createComment, getPostComments} from "../redux/slices/comments";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Post } from "../components/Post";
import { useSelector } from "react-redux";
import {CommentItem} from "../components/commentItem";
import { fetchComments } from "../redux/slices/comments.js";
import { CommentsBlock } from "../components/CommentsBlock";
import { Index } from "../components/AddComment";
import { useDispatch } from "react-redux";


export const FullPost = () => {
  const userData = useSelector(state => state.auth.data);

  const [data,setData] = React.useState();
  const [meta,setMeta] = React.useState();
  const [comment,setComment] = React.useState('');
  const { comments } = useSelector((state) => state.comment)
  const { user } = useSelector((state) => state.auth)
  const [isLoading,setLoading] = React.useState(true);
  const {id} = useParams();
  const dispatch = useDispatch();
  const params = useParams();
  const handleSubmit = () => {
    try {
        const postId = params.id
        dispatch(createComment({ postId, comment }))
        setComment('')
    } catch (error) {
        console.log(error)
    }
}


  React.useEffect(() => {
    axios.get('/posts/'+id).then((res)=> {
      setData(res.data);
      setMeta(res.meta);
      setLoading(false);
    }).catch((err) => {
      console.warn(err);
      alert('Ошибка при получении статьи');
    });
  },[]);

  const fetchComments = useCallback(async () => {
    try {
        dispatch(getPostComments(params.id))
    } catch (error) {
        console.log(error)
    }
}, [params.id, dispatch])

  useEffect(() => {
  fetchComments(id)
}, [fetchComments])

  if (isLoading) {
    return <Post isLoading = {isLoading} ifFullPost />;
  }

  return (
    <>
    <div style={{width:'100%'}}>
    
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={data.imageUrl?`http://localhost:4444${data.imageUrl}`:''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.comments?data.comments.length:"0"}
        tags={data.tags?data.tags:[]}
        isEditable={(userData&&data.user!=null)?userData._id===data.user._id:false}
        isFullPost
      >
        
        <ReactMarkdown children={data.text}/>
      </Post>    
      
                </div >
      { comments?
      <CommentsBlock
        items={comments}
        isLoading={false}
      >
        { userData &&
        <Index param = {params} items={ comment} />
      }
      </CommentsBlock>
      :<></>}
    </>
  );
};
