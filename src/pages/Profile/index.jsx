import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';

import { useSelector, useDispatch } from 'react-redux';
import {useForm} from 'react-hook-form';
import { fetchAuthMe, removeUser, selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { fetchUsersPosts } from "../../redux/slices/posts";
import { Post } from '../../components/Post/index';
import axios from '../../axios';
import styles from './Login.module.scss'
export const User = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.data);
    const { posts,tags } = useSelector(state => state.posts);
    const authStatus = useSelector(state => state.auth.status);
    const [isLoading,setLoading] = React.useState(false);
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [avatarUrl, setAvatarUrl] = React.useState('');
    const params = useParams();
    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';
    const isAuthLoading = authStatus==='loaded'
    const inputFileRef = React.useRef(null);

    const handleChangeFile = async (event) => {
        try {
          const formData = new FormData();
          const file = event.target.files[0];
          formData.append('image', file);
          const {data} = await axios.post('/upload',formData);
          setAvatarUrl(data.url);
        } catch (err) {
          console.warn(err);
          alert('Ошибка при загрузке файлов!');
        }
    
      };
    
    React.useEffect(() => {
        dispatch(fetchAuthMe())
        dispatch(fetchUsersPosts(params.id))
        axios.get(`/user/${params.id}`).then((obj) => {
        setFullName(obj.data.fullName);
        setEmail(obj.data.email);
        setAvatarUrl(obj.data.avatarUrl);
          });
    },[dispatch])

    const {register, 
        handleSubmit,
        setError, 
        formState: {errors, isValid}} = useForm({
        defaultValues: {
          fullName: '',
          email: '',
          avatarUrl: avatarUrl
        },
        mode: 'onChange',
      });

    if (!isAuth && isAuthLoading) {
        return <Navigate to ="/" />;
    };

    const onClickRemoveImage = () => {
        setAvatarUrl('');
      };
    const onClickRemoveUser = () => {
        if (window.confirm('Вы дейстивтельно хотите удалить пользователя?')) {
          dispatch(removeUser(params.id));
          navigate('/');
        }
        
      };

    const onSubmit = async (values) => {
        setLoading(true);
        const fields = {
            fullName,
            email,
            avatarUrl,
          }
        const {data} = await axios.patch(`/user/${params.id}`,fields)
      
        if ('token' in data.payload) {
          window.localStorage.setItem('token',data.payload.token);
        }
      };

    return (
        <>
          <Grid container spacing={4}>
          <Paper classes={{ root: styles.root }}>
        {userData && userData.isModerator && (
          <IconButton  onClick={onClickRemoveUser} color="secondary">
            <DeleteIcon />
          </IconButton>
          )
        }
      <Typography classes={{ root: styles.title }} variant="h5">
        {isAuthLoading?fullName:'Загрузка'}
      </Typography>
      {avatarUrl && userData && (
        <> {(userData._id === params.id)?
        <Button variant="contained" classes={{ root: styles.center }} color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
        : <></>}
        <div classes={{ root: styles.title }}>
        <Avatar  sx={{ width: 100, height: 100 }} src={`http://localhost:4444${avatarUrl}`} alt="Uploaded" />
        </div>
        </>
      )}
      <>
      {userData && (userData._id === params.id)?<>
      <Button classes={{ root: styles.title }} onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить аватар
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden /></>
      : <></>}
      </>
      <form onSubmit={handleSubmit(onSubmit)}>
        {userData && (userData._id === params.id)?
      <TextField error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName')}
        value={isAuthLoading?fullName:'Загрузка'}
        onChange={(e) => setFullName(e.target.value) }
        className={styles.field} label="Полное имя" fullWidth />
        : <></>}

        {userData && (userData._id === params.id)?<>
      <TextField error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register('email')}
        value={isAuthLoading?email:'Загрузка'}
        onChange={(e) => setEmail(e.target.value) }
        className={styles.field} label="E-Mail" fullWidth />
        <Button type="submit"  size="large" variant="contained" fullWidth>
            Изменить
        </Button></>
        : <><Typography classes={{ root: styles.title }} variant="h5">
        {isAuthLoading?`email: ${email}`:'Загрузка'}
      </Typography></>}
        </form>
    </Paper>
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
                  isEditable={(userData&&obj.user!=null)?userData._id===obj.user._id:false}
                />
              ))}
            </Grid>
          </Grid>
        </>
      );
}