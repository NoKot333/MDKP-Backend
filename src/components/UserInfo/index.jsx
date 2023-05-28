import React from 'react';
import styles from './UserInfo.module.scss';
import Avatar from '@mui/material/Avatar';
import {Link,useNavigate} from 'react-router-dom';

export const UserInfo = ({ avatarUrl, fullName, additionalText,_id }) => {
  return (
    <div className={styles.root}>
      { avatarUrl &&(
        <Avatar sx={{ width: 50, height: 50 }} src={`http://localhost:4444${avatarUrl}`} alt={fullName} />
      )
    }
      <div className={styles.userDetails}>
      <Link to={`/user/${_id}`}>
        <span className={styles.userName}>{fullName}</span>
      </Link>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
