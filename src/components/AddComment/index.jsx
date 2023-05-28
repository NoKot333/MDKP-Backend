import React from "react";

import { useCallback } from "react";
import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import { useDispatch,useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { createComment,getPostComments} from "../../redux/slices/comments";
import { fetchComments } from "../../redux/slices/comments" ;

export const Index = ({ items, param }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [isLoading,setLoading] = React.useState(true);
  const [comment,setComment] = React.useState('');
  const userData = useSelector(state => state.auth.data);
  const onSubmit = async () => {
    try {
      setLoading(true);
      const postId = params.id;
      dispatch(createComment({ postId, comment }));
      setComment('');
      dispatch(getPostComments(postId))
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.warn(err);
      alert(err);
    }
  };


  return (
    <>
      <div className={styles.root}> {
        userData && (
        <Avatar
        src = {`http://localhost:4444${userData.avatarUrl}`}
          classes={{ root: styles.avatar }}
        />)
      }
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
            multiline
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
