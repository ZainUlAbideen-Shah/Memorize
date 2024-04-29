import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import useStyles from './styles';
import { deletePost, likePost } from '../../actions/posts';

function Post({ post, setCurrentId }) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();
    const [like, setLike] = useState(post?.likes);

    const user = JSON.parse(localStorage.getItem('profile'));

    const likes = () => {
        if (like?.length > 0) {
            return like.find((like) => like === (user?.result?.googleId || user?.result?._id))
                ? (
                    <><ThumbUpAltIcon fontSize='small' />&nbsp;{like.length > 2 ? `You and ${like.length - 1} others` : `${like.length} like${like.length > 1 ? 's' : ''}`}</>
                ) : (
                    <><ThumbUpAltOutlined fontSize='small' />&nbsp;{like.length} {like.length === 1 ? 'like' : 'likes'}</>
                );
        }
        return <><ThumbUpAltOutlined fontSize='small' />&nbsp;Like</>
    };

    const userId = user?.result?.googleId || user?.result?._id;

    const handleLike = async () => {
        dispatch(likePost(post._id));
        if (like.find((like) => like === (userId))) {
            setLike(like.filter((id) => id !== (userId)))
        } else {
            setLike([...like, userId])
        }
    };

    const openPost = () => navigate(`/posts/${post._id}`);

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>

                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant='h6'>{post.name}</Typography>
                    <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {(user?.result?.googleId === post?.creator || user?.result._id === post?.creator) && (<div className={classes.overlay2} name="edit">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentId(post._id);
                        }}
                        style={{ color: 'white' }}
                        size="small"
                    >
                        <MoreHorizIcon fontSize="default" />
                    </Button>
                </div>)};
                <div className={classes.details}>
                    <Typography variant='body2' color='textSecondary'>
                        {post.tags.map((tag) => `#${tag} `)}
                    </Typography>
                </div>
                <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='p'>{post.message}</Typography>
                </CardContent>
            </ButtonBase>
            <CardActions className={classes.CardActions}>
                <Button size='small' color='primary' disabled={!user?.result} onClick={handleLike}>
                    {likes()}
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result._id === post?.creator) && (<Button style={{ marginLeft: '40px' }} size='small' color='secondary' onClick={() => dispatch(deletePost(post._id))}>
                    <DeleteIcon fontSize='small' />
                    Delete
                </Button>)}
            </CardActions>
        </Card >
    )
}

export default Post