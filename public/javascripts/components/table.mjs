import { deleteData } from "./forms.mjs";

class Table {
  constructor(id, updateFunction) {
    this.id = id;
    this.updateFunction = updateFunction;
  }
  async refreshForms() {
    document.querySelectorAll("#" + this.id + " " + "form").forEach(form => {
      form.addEventListener("submit", async event => {
        event.preventDefault();
        await this.delete(event);
      });
    });
  }
  async fill(newHTML) {
    document.getElementById(this.id).innerHTML = newHTML;
    await this.refreshForms();
  }
  async delete(event) {
    const response = await deleteData(event.target);
    if (response.status >= 400) {
      alert(await response.text());
    } else {
      const text = await response.text()
      console.log(text)
      await this.fill(text);
      this.updateFunction("deleted");
    }
  }
}

export { Table };
