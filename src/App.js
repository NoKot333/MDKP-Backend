import Container from "@mui/material/Container";
import {Routes, Route} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Header } from "./components";
import React from "react";
import { Home, FullPost, Registration, AddPost, Login, PopularHome, PostsTags,User } from "./pages";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  },[dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/popular" element={<PopularHome />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/tags/:tag" element={<PostsTags />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
