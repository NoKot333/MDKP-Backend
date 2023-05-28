import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
const initialState = {
    comments: [],
    loading: false,
}


export const getPostComments = createAsyncThunk(
    'comment/getPostComments',
    async (postId) => {
        try {
            const { data } = await axios.get(`/posts/comments/${postId}`)
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const createComment = createAsyncThunk('comment/createComment',
    async ({postId,comment}) => {
        try {
            const {data} = await axios.post(`/comments/${postId}`, {
                postId,
                comment,
            })
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const commentSlice = createSlice({
    name:'comment',
    initialState,
    reducers:{},
    extraReducers: {
        [createComment.pending]: (state) => {
            state.loading = true;
        },
        [createComment.fulfilled]: (state,action) => {
            state.comments.items = action.payload;
            state.loading = false;
        },
        [createComment.rejected]: (state) => {
            state.loading = false;
        },
        [getPostComments.pending]: (state) => {
            state.loading = true;
        },
        [getPostComments.fulfilled]: (state,action) => {
            state.comments = action.payload;
            state.loading = false;
        },
        [getPostComments.rejected]: (state) => {
            state.loading = false;
        },
    },
})
export const commentReducer = commentSlice.reducer