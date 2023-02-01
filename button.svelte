<script>
	let count = 0;
	export let characterNametwo = null;
	function handleClick() {
	  count += 1;
	  fetch('https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/222G-MI8O-ANSZ')
		.then((response) => response.json())
		.then((character) => {
			console.log(character);
		    characterNametwo = character[0].Name;
		})
	}
</script>

<style>
	button {
	  background: #ff3e00;
	  color: white;
	  border: none;
	  padding: 8px 12px;
	  border-radius: 2px;
	}
</style>

<button on:click={handleClick}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>


<h2>{characterNametwo}</h2>