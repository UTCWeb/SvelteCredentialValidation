<script>
	function validate() {
	  console.log("I'm the validate() function");
	}
	export let characterNametwo = null;
	function handleClick() {
	//   count += 1;
	  fetch('https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/222G-MI8O-ANSZ')
		.then((response) => response.json())
		.then((character) => {
			console.log(character);
		    characterNametwo = character[0].Name;
		})
	}



</script>
<!-- |preventDefault={validate} -->
<form class="credentialvalidationform block--credentialValidation" on:submit>
  <input>
	<button class="button btn--lightblue button--sm button input--submit" type="submit " on:click={handleClick}>
		test 4
	</button>
</form>


<h2>{characterNametwo}</h2>