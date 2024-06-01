import { logOut } from "./header.mjs";

const patchForms = document.querySelectorAll("form[method='patch']");
if (patchForms) await addListeners(patchForms, "submit", patchFormListeners);

const unlockButtons = document.querySelectorAll(".unlock");
if (unlockButtons) await addListeners(unlockButtons, "click", enableEdit);

const logOutButton = document.querySelector("#log_out_form");
if (logOutButton) await addListeners([logOutButton], "click", logOut);

async function addListeners(targets, type, func) {
  targets.forEach(ele =>
    ele.addEventListener(type, async event => await func(event))
  );
}

async function enableEdit(event) {
  let form = event.target.parentElement;
  for (const child of form.children) {
    if (child.localName === "input") {
      child.removeAttribute("disabled");
      child.removeAttribute("placeholder");
      child.focus();
      child.select();
    }
    if (child.type === "submit") {
      child.style.display = "inline";
    }
    if (child.type === "button") {
      child.textContent = "Cancel";
      child.removeEventListener(
        "click",
        async event => await enableEdit(event)
      );
      child.addEventListener("click", async event => await cancelEdit(event));
    }
  }
}

async function cancelEdit(event) {
  let form;
  if (event.type === "click") {
    form = event.target.parentElement;
  } else {
    form = event.target;
  }
  for (const child of form.children) {
    if (child.localName === "input") {
      child.setAttribute("disabled", true);
    }
    if (child.type === "submit") {
      child.style.display = "none";
    }
    if (child.type === "button") {
      let text = child.id.match(/[a-z]+\b/) ?? [""];
      child.textContent = "Update " + text;
      child.id = child.id.replace(/cancel/, "unlock");

      child.removeEventListener(
        "click",
        async event => await cancelEdit(event)
      );
      child.addEventListener("click", async event => await enableEdit(event));
    }
  }
}

async function patchFormListeners(event) {
  let form = event.target;
  event.preventDefault();
  const response = await patchData(form);
  if (response.status >= 400) {
    alert(await response.text());
  } else {
    document.querySelector("#confirm-update").showModal();
    await cancelEdit(event);
  }
}

async function patchData(form) {
  return await fetch(form.action, {
    body: new FormData(form),
    method: "PATCH",
    mode: "same-origin",
  });
}
