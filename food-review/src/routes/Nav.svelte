<script>
	import logo from '../images/UMass_Amherst_Athletics_logo.png';
	export let togglePostForm;
</script>

<nav class="main-nav">
	<a href="/">
		<img src={logo} alt="UMass Food Reviews" class="logo-img" />
	</a>

	<!--Navigation Links-->
	<ul>
		<div class="nav-links">
			<li><h class="title">UMass Food Review</h></li>
			<li><a href="/">Home</a></li>
			<!-- Toggle post form -->
			<li>
				<button on:click={togglePostForm} class="nav-button"> Create </button>
			</li>
			<li><a href="/about">About</a></li>
			<li><a href="/donate">Donate</a></li>
		</div>
	</ul>
</nav>

<style>
	.main-nav {
		background: #6c0000;
		color: white;
		padding: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	a {
		color: white;
		font-family: 'Arial', sans-serif;
		text-decoration: none;
		font-weight: bold;
	}

	.logo-img {
		width: 80px;
		height: 60px;
	}

	.nav-links {
		display: flex;
		align-items: center;
	}

	ul {
		display: flex;
		list-style: none;
	}

	li {
		padding: 0 30px;
	}

	.title {
		color: white;
		text-decoration: none;
		font-weight: bold;
		font-size: 30px;
		margin-right: 200px;
		font-family: 'Arial', sans-serif;
	}

	.nav-button {
		background: none;
		color: white;
		border: none;
		font-family: 'Arial', sans-serif;
		font-weight: bold;
		font-size: 16px;
		cursor: pointer;
	}
</style>
