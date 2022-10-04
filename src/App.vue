<template>
	<Comment
		:author="author"
		v-for="comment in comments"
		:key="comment.id"
		:comment="comment"
	/>
	<CreateComment :author="author" />
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import Comment from "./components/Comment.vue";
import CreateComment from "./components/CreateComment.vue";
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
	name: "App",
	components: { Comment, CreateComment },
	setup() {
		const store = useStore();
		const comments = computed(() => store.state.comments);
		const author = computed(() => store.state.currentUser);

		onMounted(() => {
			store.dispatch("getComments");
			store.dispatch("getUser");
		});

		return { comments, author };
	},
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@300;400;500;700&family=Rubik:wght@400;500;700&display=swap");
@import "@/assets/scss/variables.scss";
body {
	max-width: 730px;
	margin: auto;
	background-color: $very-light-gray;
	font-size: 16px;
	padding: 20px 0 60px;
}
#app {
	font-family: "Rubik", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul {
	margin: 0;
}
</style>
