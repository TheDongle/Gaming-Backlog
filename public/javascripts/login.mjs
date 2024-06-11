import { postData } from "./components/forms.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form[method='post']");
  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const response = await postData(form);
      if (response.status >= 400) {
        alert(await response.text());
      }
      document.innerHTML = response.text();
    });
  });
});
