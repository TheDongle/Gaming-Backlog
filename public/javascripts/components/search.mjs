import { getData } from "./forms.mjs";

class SearchForm {
  constructor(id, updateFunction) {
    this.id = id;
    this.updateFunction = updateFunction;
  }
  async lazyInit() {
    this.form = document.getElementById(this.id);
    this.input = document.querySelector("#" + this.id + " " + "input");
    this.submitBtn = document.querySelector("#" + this.id + " " + "button[type='submit']");
    this.resetBtn = document.querySelector("#" + this.id + " " + "button[type='reset']");
    this.select = document.querySelector("#" + this.id + " " + "select");
    await this.resetListener();
    await this.submitListener();
  }
  async resetListener() {
    this.form.addEventListener("reset", (event) => {
      event.preventDefault();
      this.reset();
    });
  }
  async submitListener() {
    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (this.form.dataset.cansubmit) {
        this.form.dataset.cansubmit = false;
        let data = new FormData(event.target);
        this.updateCanSubmit(false);
        await this.submit(data);
      }
    });
  }
  reset() {
    this.input.value = "";
    this.updateCanSubmit(true);
  }
  updateCanSubmit(bool) {
    this.form.dataset.cansubmit = bool;
    const elements = [this.input, this.submitBtn, this.resetBtn, this.select];
    if (bool) {
      elements.forEach((element) => {
        element.removeAttribute("disabled");
      });
    } else {
      elements.forEach((element) => {
        element.setAttribute("disabled", true);
      });
    }
  }
  async submit(data) {
    const response = await getData("/games/new", Object.fromEntries(data));
    if (response.status >= 400) {
      alert(await response.text());
      this.reset();
    } else {
      this.form.insertAdjacentHTML("afterend", await response.text());
      this.updateFunction("searched");
    }
  }
}

export { SearchForm };
