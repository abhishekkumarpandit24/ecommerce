import { useCallback, useState } from 'react';
// utils
import axios, { API_ENDPOINTS } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function useBlog() {
  const [posts, setPosts] = useState([]);

  const [post, setPost] = useState(null);

  const [latestPosts, setLatestPosts] = useState([]);

  const [postsStatus, setPostsStatus] = useState({
    loading: false,
    empty: false,
    error: null,
  });

  const [postStatus, setPostStatus] = useState({
    loading: false,
    error: null,
  });

  const handleSetPostsStatus = useCallback((name, value) => {
    setPostsStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSetPostStatus = useCallback((name, value) => {
    setPostStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const getPosts = useCallback(async () => {
    handleSetPostsStatus('loading', true);
    handleSetPostsStatus('empty', false);
    handleSetPostsStatus('error', null);
    try {
      const response = await axios.get(API_ENDPOINTS.post.list);
      setPosts(response.data.posts);
      handleSetPostsStatus('loading', false);
      handleSetPostsStatus('empty', !response.data.posts.length);
      handleSetPostsStatus('error', null);
    } catch (error) {
      console.error(error);
      handleSetPostsStatus('loading', false);
      handleSetPostsStatus('empty', false);
      handleSetPostsStatus('error', error);
    }
  }, [handleSetPostsStatus]);

  const getPost = useCallback(
    async (title) => {
      handleSetPostStatus('loading', true);
      handleSetPostStatus('error', null);
      try {
        const response = await axios.get(API_ENDPOINTS.post.details, {
          params: {
            title,
          },
        });
        setPost(response.data.post);
        handleSetPostStatus('loading', false);
        handleSetPostStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetPostStatus('loading', false);
        handleSetPostStatus('error', error);
      }
    },
    [handleSetPostStatus]
  );

  const getLatestPosts = useCallback(async (title) => {
    try {
      const response = await axios.get(API_ENDPOINTS.post.latest, {
        params: {
          title,
        },
      });
      setLatestPosts(response.data.posts);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    post,
    posts,
    latestPosts,
    //
    postsStatus,
    postStatus,
    //
    getPost,
    getPosts,
    getLatestPosts,
  };
}
