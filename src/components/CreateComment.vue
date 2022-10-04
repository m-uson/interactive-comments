<template>
	<div class="create-comment" v-if="author">
		<form @submit.prevent="handleSubmit" class="create-comment__form">
			<img class="create-comment__image" :src="author.image.png" alt="" />
			<div class="create-comment__description">
				<textarea class="create-comment__text" v-model="desctiption"></textarea>
			</div>
			<button v-if="isReplying" class="btn-primary">REPLY</button>
			<button v-else class="btn-primary">SEND</button>
		</form>
	</div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
export default {
	props: ["author", "isReplying", "comment"],
	setup(props) {
		const desctiption = ref("");
		const store = useStore();

		const handleSubmit = async () => {
			const newComment = {
				content: desctiption.value,
				createdAt: new Date(),
				score: [],
				user: props.author,
				replies: [],
			};

			if (props.isReplying) {
				delete newComment.replies
				store.dispatch("creaReplyComment", {
					newComment,
					id: props.comment.id,
				});
			}
			if (!props.isReplying) {
				store.dispatch("createComment", newComment);
			}
		};

		return { desctiption, handleSubmit };
	},
};
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/buttons.scss";
.create-comment {
	background-color: #fff;
	padding: 25px;
	border-radius: 10px;
	&__form {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}
	&__image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	&__description {
		width: 100%;
		margin: 0 20px;
	}
	&__text {
		font-family: "Rubik", sans-serif;
		resize: none;
		width: 100%;
		height: 90px;
		box-sizing: border-box;
		padding: 15px 25px;
		line-height: 1.5;
		font-weight: 400;
		color: $dark-blue;
		border-radius: 5px;
		border: 1px solid $dark-blue;
	}
}
</style>