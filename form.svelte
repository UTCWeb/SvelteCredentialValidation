<script>
	function validate() {
	  console.log("I'm the validate() function");
	}
</script>

<form on:submit|preventDefault={validate}>
	<input>
	<button type="submit">
		Please save me
	</button>
  <input>
	<button type="submit">
		test 2
	</button>
  <input>
	<button type="submit">
		test 3 
	</button>
  <input>
	<button type="submit">
		test 4
	</button>
</form>