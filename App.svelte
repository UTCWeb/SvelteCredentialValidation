<script>
	import Button from "./button.svelte";
	import Form from "./form.svelte";

	let p = 'MyName'
	// $: nameUpper = p.toUpperCase()
	// var characterName = p;
	function handleOnSubmit() {
	//   console.log("I'm the handleOnSubmit() in App.svelte");
	//   fetch('https://swapi.dev/api/people/1')
	// 	.then((response) => response.json())
	// 	.then((character) => {
	// 		characterName = character.name;
	// 	})
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

<Form on:submit={handleOnSubmit}>
</Form>


<main>
	<h1>Hello CodeSandbox</h1>
	<h2>Start editing to see some magic happen!</h2>
    <!-- {characterName} -->
</main>