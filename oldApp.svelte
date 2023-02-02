<script>
	import Button from "./button.svelte";
	import Form from "./form.svelte";

	let p = 'MyName'
	// $: nameUpper = p.toUpperCase()
	let characterName = "test";
	function handleSubmit() {
	  fetch('https://swapi.dev/api/people/1')
		.then((response) => response.json())
		.then((character) => {
			characterName = character.name;
		})

		// console.log("I'm the handleOnSubmit() in App.svelte");

	}


</script>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<main>
	<h1>Hello CodeSandbox</h1>
	<h2>Start editing to see some magic happen!</h2>
	<Button />
    <!-- {characterNametwo} -->
</main>

<Form on:submit={handleSubmit}>
</Form>

<main>
	<h1>Hello CodeSandbox</h1>
	<h2>Start editing to see some magic happen!</h2>
    {characterName}
</main>