import { createStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

export default createStore({
  state: {
    comments: [],
    currentUser: null,
  },
  getters: {
    getCurrentComment: (state) => (id) => {
      return state.comments.find((item) => item.id === id);
    },
  },
  mutations: {
    SET_COMMENTS(state, comments) {
      state.comments = comments;
    },
    SET_USER(state, user) {
      state.currentUser = user;
    },
    ADD_COMMENT_LIKE(state, comment) {
      comment.score = [...comment.score, state.currentUser.id];
    },
    DELETE_COMMENT_LIKE(state, comment) {
      comment.score = comment.score.filter((id) => id !== state.currentUser.id);
    },
    CREATE_COMMENT(state, newComment) {
      state.comments.push(newComment);
    },
    CREATE_REPLY_COMMENT(state, { currentComment, newComment }) {
      currentComment.replies = [...currentComment.replies, newComment];
    },
    ADD_REPLY_COMMENT_LIKE(state, replyComment) {
      replyComment.score.push(state.currentUser.id);
    },
    DELETE_REPLY_COMMENT_LIKE(state, replyComment) {
      replyComment.score = replyComment.score.filter((reply) => reply.id === state.currentUser.id);
    },
  },
  actions: {
    async getComments({ commit }) {
      const response = await fetch('http://localhost:3000/comments');
      const json = await response.json();
      commit('SET_COMMENTS', json);
    },
    async getUser({ commit }) {
      const response = await fetch('http://localhost:3000/currentUser');
      const json = await response.json();
      commit('SET_USER', json);
    },
    async addLikeToComment({ commit, state, getters }, id) {
      const comment = getters.getCurrentComment(id);

      await fetch('http://localhost:3000/comments/' + id, {
        method: 'PATCH',
        body: JSON.stringify({ score: [state.currentUser.id] }),
        headers: { 'Content-Type': 'application/json' },
      });
      commit('ADD_COMMENT_LIKE', comment);
    },
    async deleteLikeFromComment({ commit, getters }, id) {
      const comment = getters.getCurrentComment(id);

      commit('DELETE_COMMENT_LIKE', comment);

      await fetch('http://localhost:3000/comments/' + id, {
        method: 'PATCH',
        body: JSON.stringify({ score: comment.score }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    async createComment({ commit }, newComment) {
      await fetch('http://localhost:3000/comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: { 'Content-Type': 'application/json' },
      });
      commit('CREATE_COMMENT', newComment);
    },
    async creaReplyComment({ commit, getters }, { newComment, id }) {
      const currentComment = getters.getCurrentComment(id);

      const newReplyComment = { ...newComment, id: uuidv4() };

      await fetch('http://localhost:3000/comments/' + id, {
        method: 'PATCH',
        body: JSON.stringify({
          replies: [...currentComment.replies, newReplyComment],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      commit('CREATE_REPLY_COMMENT', { currentComment, newComment });
    },
    async addLikeToReplyComment({ commit, getters }, { parentId, replyId }) {
      const currentComment = getters.getCurrentComment(parentId);

      const replyComment = currentComment.replies.find((reply) => reply.id === replyId);

      commit('ADD_REPLY_COMMENT_LIKE', replyComment);

      await fetch('http://localhost:3000/comments/' + parentId, {
        method: 'PATCH',
        body: JSON.stringify({ replies: currentComment.replies }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    async deleteLikeFromReplyComment({ commit, getters }, { parentId, replyId }) {
			const currentComment = getters.getCurrentComment(parentId);

      const replyComment = currentComment.replies.find((reply) => reply.id === replyId);

      commit('DELETE_REPLY_COMMENT_LIKE', replyComment);

      await fetch('http://localhost:3000/comments/' + parentId, {
        method: 'PATCH',
        body: JSON.stringify({ replies: currentComment.replies }),
        headers: { 'Content-Type': 'application/json' },
      });
		},
  },
});
