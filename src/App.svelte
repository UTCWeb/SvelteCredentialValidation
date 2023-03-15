<script>
  // Blank field that checks input.
  let idkey = " ";
  let credentialarray = [];
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
    fetch(
      "https://web.api.endpoints.utc.edu/api/credential/" +
        idkey
    )
      .then((response) => response.json())
      .then((data) => (credentialarray = data));
  }
</script>

<form
  class="credentialvalidationform col-end-2"
  on:submit|preventDefault={handleSubmit(idkey)}
>
  <div class="credentialvalidation_form_title">
    <h2 class="credentialvalidationtitle">Credential Validation</h2>
  </div>
  <div
    class="credentialvalidation_form ceflex credential_validation_result_message"
  >
    <div class="ceflexform max-w-xs">
      <label for="ceDiD" class="ceDiDlabel cedidrequired">CeDiD</label>
      <input type="text" id="utccredential" bind:value={idkey} />
      <button
        class="cebutton cebtn--lightblue button--sm cevalidatebutton"
        type="submit"
      >
        Validate
      </button>
    </div>
    <div class="credential_validation_result_message cepl-32">
      {#if credentialarray.length > 0 && credentialarray[0].CeDiplomaID === ""}
        <p class="cep-2">
          We cannot validate the Credential at this time. Please contact
          apostille@utc.edu for assistance. When you do, please provide the
          student name and CeDiD
        </p>
      {/if}
      {#if idkey === " " || idkey === ""}
        <p class="cep-2" >Make sure to enter a valid ID for example 222G-MI3O-ZZZZ</p>
      {:else if credentialarray.length > 0 && credentialarray[0].CeDiplomaID !== ""}
        {#each credentialarray as index}
          <tbody>
            <tr><td><b />This is a valid credential<b /> </td><td>{dateTime}</td></tr>
            <tr><td><b>CeDiD:</b></td><td>{index.CeDiplomaID}</td></tr>
            <tr><td><b>Name:</b></td><td>{index.Name}</td></tr>
            <tr><td><b>Conferral Date: </b></td><td>{index.ConferralDate}</td></tr>
            <tr><td><b>Credential:</b></td><td>{index.Degree1}</td></tr>
            {#if (index.Major1 !== "")}
             <tr><td><b>Major:</b></td><td>{index.Major1}</td></tr>
            {/if}
          </tbody>
        {/each}
      {/if}
    </div>
  </div>

  <p class="credentialvalidation_form_footer">
    Powered by <a href="https://secure.cecredentialtrust.com/"
      >CeCredentialTrust</a
    >
  </p>
</form>

<!-- {submit} -->
<style>
  .cedidrequired::after {
    content: "*";
    color: red;
    padding: 0.2rem;
  }
  @media (min-width: 200px) {
    .max-w-xs {
      max-width: 20rem;
    }
  }
  .ceflexform {
    display: flex;
    flex-direction: column;
  }
  .cep-2
  {
    padding: 0.5rem
  }
  .ceDiDlabel {
    font-weight: bold;
    font-size: 0.85rem;
  }
  .cevalidatebutton {
    margin-top: 2rem;
  }
  .cebutton {
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
  .cebtn--lightblue {
    --tw-bg-opacity: 1;
    background-color: rgba(226, 232, 240, var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgba(17, 46, 81, var(--tw-text-opacity));
    border: 0;
  }
  .credential_validation_result_message {
    border-collapse: collapse;
    width: 100%;
    margin: 0rem 0 1rem 0;
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
  @media (min-width: 768px) {
    .credentialvalidation_form {
      margin-left: 2rem;
    }
    .ceflex {
      display: flex;
    }
    .cepl-32 {
      padding-left: 8rem;
    }
    .credential_validation_result_message p {
      max-width: 25rem;
    }
  }
</style>
