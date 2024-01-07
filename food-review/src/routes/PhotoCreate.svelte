<script>
	import { imageStore } from './stores.js';

	let title = '';
	let description = '';
	let imageFile = [];

	const createPost = async (event) => {
		event.preventDefault();

		// Now create a new formData for photos and info
		const formData = new FormData();

		formData.append('title', title);
		formData.append('description', description);
		formData.append('image', imageFile[0]);

		try {
			// Do POST request to route before fetching
			await fetch('http://localhost:4000/photos', {
				method: 'POST',
				body: formData
			});

			// After successful upload, fetch the latest photos and infos
			const photoRes = await fetch('http://localhost:4000/photos');
			const updatedPhotos = await photoRes.json();

			const infoRes = await fetch(`http://localhost:4002/photos`);
			const updatedInfos = await infoRes.json();

			// Update the store to reflect the new image
			imageStore.update((store) => {
				return { ...store, photos: updatedPhotos, infos: updatedInfos };
			});

			// empty out textbox
			title = '';
			description = '';

			// displaying status after creating photo post
			document.getElementById('uploadStatus').innerText = 'Upload successful!';
		} catch (error) {
			console.error('Error:', error);
		}
	};
</script>

<div class="form-container">
	<form id="uploadForm" on:submit|preventDefault={createPost}>
		<!-- Title -->
		<div class="form-control">
			<label for="title">Title:</label>
			<input bind:value={title} id="title" />
		</div>

		<!-- Description -->
		<div class="form-control">
			<label for="desc">Description:</label>
			<textarea bind:value={description} id="desc"></textarea>
		</div>

		<!-- Upload image -->
		<div class="form-control">
			<label for="image">Upload Image:</label>
			<input type="file" id="imageInput" bind:files={imageFile} />
		</div>

		<!-- Submit button -->
		<button type="submit" id="submitBtn">Submit</button>
	</form>
	<div id="uploadStatus"></div>
</div>

<style>
	.form-container {
		max-width: 500px;
		margin: 0 auto;
		padding: 20px;
		background: #eee;
		border-radius: 10px;
	}

	.form-control {
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}

	label {
		font-weight: bold;
	}

	input,
	textarea {
		padding: 10px;
		border-radius: 5px;
		border: 1px solid #ccc;
	}
</style>
