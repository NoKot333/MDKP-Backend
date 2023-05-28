import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

//import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPostsTag, fetchTags } from '../redux/slices/posts';
import { useParams } from "react-router-dom";

export const PostsTags = () => {
  
  const dispatch = useDispatch();  
  const userData = useSelector(state => state.auth.data);
  const { posts } = useSelector(state => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const {tag} = useParams();

  React.useEffect(() => {
    dispatch(fetchPostsTag(tag));
  },[dispatch])

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)]: posts.items).map((obj,index) => isPostsLoading ? (
            <Post key={index} isLoading ={true} />
            ) : (
              <Post 
              _id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}`:''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={obj.comments.length}
              tags={obj.tags}
              //isEditable={userData?userData._id===obj.user._id:false}
            />
          ))}
        </Grid>
      </Grid>
      
    </>
  );
};
