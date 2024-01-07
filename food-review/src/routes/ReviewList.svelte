<script>
	export let reviews = [];
	export let photoId;
	let deletedReviewId;

	const deleteReview = async (id, photoId) => {
		try {
			// reviews updated after successful delete
			await fetch(`http://localhost:4002/delete?id=${id}&photoId=${photoId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			deletedReviewId = id;
		} catch (err) {
			console.error(err);
		}
	};

	// displaying status after creating photo post
</script>

<ul class="reviews">
	{#each reviews as review (review.id)}
		<li class="review">
			<div class="review-content">{review.content}</div>
			<div class="reviewer">
				- User {review.id} <span class="spacer"></span> Rated: {review.rating}/5
				<span class="spacer"></span>
				<button class="submit-btn"> Edit </button>
				<button class="submit-btn" on:click={() => deleteReview(review.id, photoId)}>
					Delete
				</button>
				{#if deletedReviewId === review.id}
					<p>Successfully deleted {review.id}! Loading...</p>
				{/if}
			</div>
		</li>
	{/each}
</ul>

<style>
	.reviews {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.review {
		margin-bottom: 20px;
	}

	.review-content {
		padding: 10px;
		background: #eee;
		border-radius: 4px;
	}

	.reviewer {
		font-size: 0.9em;
		color: #777;
	}

	.spacer {
		margin-left: 30px;
		display: inline-block;
	}

	.submit-btn {
		background: #6c0000;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 4px 10px;
		font-size: 0.9em;
		cursor: pointer;
	}
</style>
