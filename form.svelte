<script>
	function validate() {
	  console.log("I'm the validate() function");
	}
</script>
<!-- |preventDefault={validate} -->
<form class="credentialvalidationform block--credentialValidation" on:submit>
  <input>
	<button class="button btn--lightblue button--sm button input--submit" type="submit">
		test 4
	</button>
</form>