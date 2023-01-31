<script>
	function validate() {
	  console.log("I'm the validate() function");
	}
</script>

<form class="credentialvalidationform block--credentialValidation" on:submit|preventDefault={validate}>
  <input>
	<button class="button btn--lightblue button--sm button input--submit" type="submit">
		test 4
	</button>
</form>