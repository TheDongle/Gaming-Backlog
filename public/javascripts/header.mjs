let logOutLink;

document.addEventListener("DOMContentLoaded", async () => {
  logOutLink = document.getElementById("log_out_link");
  if (logOutLink !== null) {
    logOutLink.addEventListener("click", async (event) => {
      event.preventDefault();
      await logOut();
    });
  }
});

async function logOut() {
  const send = async () =>
    await fetch("/", {
      body: "",
      method: "DELETE",
      mode: "same-origin",
    });
  const response = await send();
  if (response.status >= 400) {
    alert(await response.text());
  } else {
    location.replace("/")
  }
}

export { logOut };
