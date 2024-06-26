import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import useStyles from './styles';
import { createPosts, updatePost } from '../../actions/posts';

function Form({ currentId, setCurrentId }) {
    const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();

    const [postData, setPostData] = useState({
        title: '', message: '', tags: '', selectedFile: ''
    });

    useEffect(() => {
        if (post) setPostData(post);
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentId) {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }))
            clear();
        }
        else {
            dispatch(createPosts({ ...postData, name: user?.result?.name }, navigate));
            clear();
        }
    };

    const clear = () => {
        setCurrentId(null);
        setPostData({ title: '', message: '', tags: '', selectedFile: '' })
    };

    if (!user) {
        return (
            <Paper className={classes.paper}>
                <Typography variant='h6' align='center'>
                    Please sign in first to go down MEMORY LANE...
                </Typography>
            </Paper>
        )
    };

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant='h6'>{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
                <TextField name='title' variant='outlined' label='Title' fullWidth value={postData.title} onChange={(e) => { setPostData({ ...postData, title: e.target.value }) }} />
                <TextField name='message' variant='outlined' label='Message' fullWidth value={postData.message} onChange={(e) => { setPostData({ ...postData, message: e.target.value }) }} />
                <TextField name='tags' variant='outlined' label='Tags' fullWidth value={postData.tags} onChange={(e) => { setPostData({ ...postData, tags: e.target.value.split(', ') }) }} />
                <div className={classes.fileInput}>
                    <FileBase type='file' multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
                </div>
                <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>Submit</Button>
                <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth  >Clear</Button>
            </form>
        </Paper>
    )
}

export default Form