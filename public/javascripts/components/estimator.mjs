class DaysToComplete {
  constructor(id, tableId) {
    this.id = id;
    this.tableId = tableId;
  }
  async lazyInit() {
    this.article = document.getElementById(this.id);
    this.hoursTextTarget = document.querySelector("#" + this.id + " " + "b");
    let text = document.querySelectorAll("#" + this.id + " " + "p");
    this.coolText = text[0];
    this.lameText = text[1];
    await this.makeEstimate();
  }
  async textVisibility(bool) {
    this.lameText.style.display = bool ? "none" : "block";
    this.coolText.style.display = bool ? "block" : "none";
    this.article.dataset.ishidden = !bool;
  }
  async makeEstimate() {
    const hoursElement = document.querySelector(
      "#" + this.tableId + " " + "tfoot" + " " + "td"
    );
    if (hoursElement !== null) {
      await this.textVisibility(true);
      let hoursNum = parseInt(hoursElement.innerText);
      this.hoursTextTarget.innerText = Math.ceil(hoursNum / 4) + " days";
    } else {
      await this.textVisibility(false);
    }
  }
}

export { DaysToComplete };
