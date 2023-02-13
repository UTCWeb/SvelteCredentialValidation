<script>
  // Blank field that checks input.
  let idkey = " ";
  let array = [];
  let today = new Date();
  let dateTime =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();

  function handleSubmit(idkey) {
    if (idkey == " " || idkey == "") {
      return;
    }
    console.log(idkey);
    fetch(
      "https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/" +
        idkey
    )
      .then((response) => response.json())
      .then((data) => (array = data));
    array = array;
  }
</script>

<form
  class="credentialvalidationform col-end-2"
  on:submit|preventDefault={handleSubmit(idkey)}
>
  <div class="credentialvalidation_form_title">
    <h2>Credential Validation</h2>
  </div>
  <div class="credentialvalidation_form grid grid-cols-2 credential_validation_result_message">
    <div class="grid gap-4 max-w-xs">
      <label for="ceDiD">CeDiD</label><br>
      <input type="text" id="utccredential" bind:value={idkey} />
      <button class="button btn--lightblue button--sm button" type="submit">
        Validate
      </button>
    </div>
    {#if array.length > 0 && array[0].CeDiplomaID === ""}
      <!-- <p> Invalid ID, 222G-MI3O-ZZZZ. Don't forget the dash.</p> -->
      <p>
        We cannot validate the Credential at this time. Please contact
        apostille@utc.edu for assistance. When you do, please provide the
        student name and CeDiD
      </p>
    {/if}
    {#if idkey === " " || idkey === ""}
      <p>Make sure to enter a valid ID for example 222G-MI3O-ZZZZ</p>
      <!-- {:else if array.length === 0 && array[0].CeDiplomaID === "" } 
      <p>Invalid ID - It should look like 222G-MI3O-ZZZZ </p> -->
    {:else if array.length > 0 && array[0].CeDiplomaID !== ""}
      {#each array as index}
        <!-- {index.Name}
        {index.Degree1}
        {index.SchoolName} -->
        <div class="credential_validation_result_message">
          <tbody>
            <!-- 02/Feb/2023 15:39:11 -->
            <tr
              ><td><b />This is a valid credential<b /> </td><td>
                {dateTime}</td
              ></tr
            ><tr><td><b>CeDiD:</b></td><td>{index.CeDiplomaID}</td></tr><tr
              ><td><b>Name:</b></td><td>{index.Name}</td></tr
            ><tr
              ><td><b>Conferral Date: </b></td><td>{index.ConferralDate}</td
              ></tr
            ><tr><td><b>Credential:</b></td><td>{index.Degree1}</td></tr></tbody
          >
        </div>
      {/each}
    {/if}
  </div>

  <p class="credentialvalidation_form_footer">
    Powered by <a href="https://secure.cecredentialtrust.com/"
      >CeCredentialTrust</a
    >
  </p>
</form>

<!-- {submit} -->
<style>
  @media only screen and (min-width: 900px) {
    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media only screen and (min-width: 200px) {
    .grid {
      display: grid;
    }
    .gap-4 {
      grid-gap: 1rem;
    }
    .max-w-xs {
      max-width: 20rem;
    }
  }
  .button {
    /* display: inline-block; */
    background-color: transparent;
    padding: 10px 1.5rem;
    border: 1px solid;
    border-color: #cfd8dc;
    border-radius: 0.25rem;
    color: #263238;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  .btn--lightblue {
    --tw-bg-opacity: 1;
    background-color: rgba(226, 232, 240, var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgba(17, 46, 81, var(--tw-text-opacity));
    border: 0;
  }
  .credential_validation_result_message {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0 1rem 0;
  }

  .credential_validation_result_message td {
    border: 1px solid #edf2f7;
    padding: 8px;
  }

  .credential_validation_result_message tr:nth-child(even) {
    background-color: #e2e8f0;
  }

  .credential_validation_result_message tr:hover {
    background-color: #edf2f7;
  }

  .credentialvalidationform {
    margin-top: 3rem;
    margin-bottom: 2rem;
    padding-top: 1rem;
    background: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .credentialvalidation_form_title {
    margin-left: 2rem;
  }
  .credentialvalidation_form {
    margin-left: 2rem;
  }
  .credentialvalidation_form_footer {
    margin-left: 2rem;
    margin-right: 2rem;
    padding-bottom: 1rem;
  }
  .credential_validation_result_message p {
    background: #e2e8f0;
    /* padding: 1rem; */
    max-width: 20rem;
}
  /*min width comes from tailwindcss 'md': '768px' size */
  @media (min-width: 900px) {
    .credential_validation_result_message {
      margin-left: 3rem;
    }
    .credential_validation_result_message p {
      max-width: 30rem;
}
    
  }
</style>
