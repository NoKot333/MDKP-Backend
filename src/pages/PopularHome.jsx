import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

//import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags,fetchPopularPosts } from '../redux/slices/posts';

export const PopularHome = () => {
  
  const dispatch = useDispatch();  
  const userData = useSelector(state => state.auth.data);
  const { posts} = useSelector(state => state.posts);

  const isPostsLoading = posts.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPopularPosts());
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