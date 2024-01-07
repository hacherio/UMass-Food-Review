<script>
	import { imageStore } from './stores.js';
	import { avgRatingStore } from './stores.js';

	// The post ID associated with the comment
	export let photoId;

	// The review content
	let content = '';

	// For star rating
	let rating = 0;

	// Star rating set
	const setRating = (newRating) => {
		rating = newRating;
	};

	const postReview = async (event) => {
		event.preventDefault();

		await fetch(`http://localhost:4001/photos/${photoId}/reviews`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content, rating })
		});

		// Fetch the updated list of reviews
		const newRes = await fetch(`http://localhost:4001/photos/${photoId}/reviews`);
		const newData = await newRes.json();

		// Update the infos in the imageStore
		imageStore.update((store) => {
			if (store.infos && store.infos[photoId]) {
				store.infos[photoId].reviews = newData.reviews;
			}
			return store;
		});

		// Update the avgRating store with the new value
		avgRatingStore.update((ratings) => {
			const updatedRatings = { ...ratings };
			updatedRatings[photoId] = newData.averageRating;
			return updatedRatings;
		});
		content = '';
	};
</script>

<div class="review-container">
	<form on:submit={postReview}>
		<div class="review-content">
			<textarea bind:value={content} placeholder="Write your review here..."></textarea>
		</div>
		<div class="rating">
			{#each [1, 2, 3, 4, 5] as star}
				<button type="button" class="star" on:click={() => setRating(star)}>
					{star <= rating ? '⭐' : '☆'}
				</button>
			{/each}
		</div>
		<button class="submit-btn"> Add Review</button>
	</form>
</div>

<style>
	.star {
		cursor: pointer;
		font-size: 25px;
		background: none;
		border: none;
	}

	.rating {
		display: inline-block;
		vertical-align: top;
	}

	textarea {
		width: 500px;
		height: 100px;
		margin-bottom: 10px;
		padding: 10px;
		font-family: Arial;
		object-fit: cover;
		display: inline-block;
		vertical-align: top;
	}

	.submit-btn {
		background: #6c0000;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 8px 20px;
		font-size: 16px;
		cursor: pointer;
	}

	.review-container {
		margin-bottom: 20px;
		padding-bottom: 20px;
	}
</style>
