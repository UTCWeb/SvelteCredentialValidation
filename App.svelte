<script>
	import Button from "./button.svelte";
	import Form from "./form.svelte";

	function handleOnSubmit() {
	  console.log("I'm the handleOnSubmit() in App.svelte");
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
</main>

<Form on:submit={handleOnSubmit}>
</Form>