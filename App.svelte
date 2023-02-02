<script>
	let value = 'world'
	let submit = false
	let characterNametwo = 'default'
    let idkey = 'blank'
    let array = [];
    // document.getElementById("utccredential")[0]
	function handleSubmit(idkey) {
		submit = true
        console.log(idkey);
        fetch('https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/'+idkey)
		.then((response) => response.json())
        .then( data => array = data)
		.then((character) => {
			console.log(character);
		    characterNametwo = character[0].Name;
            // array = response;
		})
        characterNametwo = characterNametwo;
        array = array;
        // console.log(array);
	}
	
	const handleKeyup = () => {
		submit = false
		
		if (event.code == 'Enter') {
			event.preventDefault()
			event.target.value
			value = event.target.value
			return false
		}
        event.target.value
        // fetch('https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/222G-MI8O-ANSZ')
        // fetch('https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/'+ event.target.value)
		// .then((response) => response.json())
		// .then((character) => {
		// 	console.log(character);
		//     characterNametwo = character[0].Name;
		// })


	}
</script>


<form on:submit|preventDefault={handleSubmit(idkey)}>
	<!-- <input type="text" on:keyup|preventDefault={handleKeyup}> -->
    <input type="text" id="utccredential" bind:value={idkey}>
	<button type="submit">
		Submit
	</button>
</form>

{submit}
{#each array as index}
{index.Name}
{index.Degree1}
{index.SchoolName}
{/each}

{array}
{characterNametwo}
<h1>Hello {value}!</h1>