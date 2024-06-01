import { postData } from "./forms.mjs";

class ResultsForm {
  constructor(id, updateFunction) {
    this.id = id;
    this.updateFunction = updateFunction;
    this.newHTML = "";
  }
  async prepNewForm() {
    this.form = document.getElementById(this.id);
    this.submitBtn = document.querySelector(
      "#" + this.id + " " + "button[type='submit']"
    );
    this.resetBtn = document.querySelector(
      "#" + this.id + " " + "button[type='reset']"
    );
    await this.resetListener();
    await this.submitListener();
  }
  async resetListener() {
    this.form.addEventListener("reset", event => {
      event.preventDefault();
      this.removeForm();
    });
  }
  async submitListener() {
    this.form.addEventListener("submit", async event => {
      event.preventDefault();
      if (this.form.dataset.cansubmit) {
        this.removeForm();
        await this.submit(event);
      }
    });
  }
  removeForm() {
    this.form.dataset.cansubmit = false;
    this.form.remove();
    this.updateFunction("reset");
  }
  async submit(event) {
    // Form element is already removed from page, but the event persists
    this.updateFunction("loading");
    const response = await postData(event.target);
    if (response.status >= 400) {
      alert(await response.text());
      // Ensures other page elements refresh on error
      this.updateFunction("reset");
    } else {
      this.newHTML = await response.text();
      this.updateFunction("created");
    }
  }
}

export { ResultsForm };
