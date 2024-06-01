import { DaysToComplete } from "./components/estimator.mjs";
import { SearchForm } from "./components/search.mjs";
import { ResultsForm } from "./components/results.mjs";
import { Table } from "./components/table.mjs";

// This one attribute will store my state
const STATE_ELEMENT = document.getElementById("main");
const STATE_ATTRIBUTE = "state";
const updateState = data => {
  STATE_ELEMENT.dataset[STATE_ATTRIBUTE] = data;
};

const COMPONENTS = new Map();
async function addComponents(COMPONENTS) {
  COMPONENTS.set("table", new Table("table-container", updateState));
  COMPONENTS.set("searchForm", new SearchForm("search-form", updateState));
  COMPONENTS.set("resultsForm", new ResultsForm("results-form", updateState));
  COMPONENTS.set(
    "estimator",
    new DaysToComplete("estimate-area", "table-container")
  );
  COMPONENTS.set(
    "loadingSentence",
    document.getElementById("loading-sentence")
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  await addComponents(COMPONENTS);
  await COMPONENTS.get("searchForm").lazyInit();
  await COMPONENTS.get("estimator").lazyInit();
  await COMPONENTS.get("table").refreshForms();
  await lazyObserve(await createObserver());
});

async function createObserver() {
  return new MutationObserver(async mutation => {
    const state = mutation[0].target.dataset[STATE_ATTRIBUTE];
    switch (state) {
      case "searched":
        await COMPONENTS.get("resultsForm").prepNewForm();
        break;
      case "reset":
        await COMPONENTS.get("searchForm").reset();
        break;
      case "loading":
        await COMPONENTS.get("searchForm").reset();
        COMPONENTS.get("loadingSentence").style.display = "block";
        break;
      case "created":
        await COMPONENTS.get("table").fill(
          COMPONENTS.get("resultsForm").newHTML
        );
        await COMPONENTS.get("estimator").makeEstimate();
        break;
      case "deleted":
        await COMPONENTS.get("estimator").makeEstimate();
        break;
    }
  });
}

async function lazyObserve(observer) {
  observer.observe(STATE_ELEMENT, {
    attributes: true,
    attributeFilter: ["data-" + STATE_ATTRIBUTE],
  });
}
