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
  const res = () => {
    const options = {
      method: "DELETE",
      mode: "same-origin",
    };
    const resource = new Request("/");
    return fetch(resource, options);
  };
  const url = await (await res()).text();
  location.replace(url);
}

export { logOut };
