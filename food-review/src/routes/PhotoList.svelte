<script>
	import { onMount } from 'svelte';
	import { imageStore, avgRatingStore } from './stores.js';
	import ReviewCreate from './ReviewCreate.svelte';
	import ReviewList from './ReviewList.svelte';

	let photos = [];
	let infos = [];
	let avgRatings = {};

	// Subscribe to the imageStore to have photos and infos updated
	imageStore.subscribe((store) => {
		photos = store.photos;
		infos = store.infos;
	});

	// Subscribe to the avgRating store to keep it updated
	avgRatingStore.subscribe((ratings) => {
		avgRatings = ratings;
	});

	// Function to load average ratings
	async function loadAverageRating(photoId) {
		const res = await fetch(`http://localhost:4001/photos/${photoId}/reviews`);
		const data = await res.json();
		avgRatingStore.update((ratings) => {
			ratings[photoId] = data.averageRating;
			return ratings;
		});
	}

	// Fetch initial list of photos when the component mounts
	onMount(async () => {
		const photoRes = await fetch('http://localhost:4000/photos');
		const initialPhotos = await photoRes.json();

		const infoRes = await fetch(`http://localhost:4002/photos`);
		const initialInfo = await infoRes.json();

		imageStore.set({ photos: initialPhotos, infos: initialInfo });
	});
</script>

<div>
	{#if photos.length}
		{#each photos as photo}
			<!-- Get photo info -->
			{#await infos[photo._id]}
				<p>Loading...</p>
			{:then info}
				<h3>{info.title}</h3>
				<p>{info.description}</p>

				<div class="flex">
					<!-- Load image using ID route -->
					<img src="http://localhost:4000/photos/{photo._id}" alt={photo.title} />

					<!-- Load rating using ID route -->
					{#await loadAverageRating(photo._id)}
						<p>Loading ratings...</p>
					{:then data}
						<p>Average Rating: {avgRatings[photo._id]}</p>
					{:catch error}
						<p>Error loading ratings</p>
					{/await}

					<!-- Load reviews and form -->
					<div>
						<ReviewCreate bind:photoId={photo._id} />
						<ReviewList reviews={info.reviews} bind:photoId={photo._id} />
					</div>
				</div>
			{:catch error}
				<p>Error getting photo details</p>
			{/await}
			<hr />
		{/each}
	{:else}
		<p>Empty post. Perhaps post a new picture of your food? 🧑‍🍳</p>
	{/if}
</div>

<style>
	hr {
		height: 8px;
		background-color: #c4c2c2;
		border: none;
		border-radius: 4px;
	}

	img {
		width: 500px;
		height: 500px;
		object-fit: cover;
	}

	.flex {
		display: flex;
		gap: 20px;
	}
</style>
