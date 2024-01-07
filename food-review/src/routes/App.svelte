<script>
	import PhotoCreate from './PhotoCreate.svelte';
	import PhotoList from './PhotoList.svelte';
	import Nav from './Nav.svelte';
	let showPostForm = false;
	function togglePostForm() {
		showPostForm = !showPostForm;
	}
</script>

<Nav {togglePostForm} />

<!-- Show/hide post form -->
{#if showPostForm}
	<div class="post-form">
		<h2>Create a post</h2>
		<PhotoCreate />
	</div>
{/if}


<PhotoList />

<style>
	.post-form {
		padding: 20px;
		background: #eee;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	h1 {
		color: white;
		font-weight: bold;
		font-size: 40px;
		font-family: 'arial';
	}
</style>
