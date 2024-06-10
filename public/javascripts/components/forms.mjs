async function postData(form) {
  return await fetch(form.action, {
    body: new FormData(form),
    method: "POST",
    mode: "same-origin",
  });
}

async function deleteData(form) {
  return await fetch(form.action, {
    body: new FormData(form),
    method: "DELETE",
    mode: "same-origin",
  });
}

async function getData(url, headers) {
  return await fetch(url, {
    headers,
    method: "GET",
    mode: "same-origin",
    cache: "default",
  });
}

export { postData, getData, deleteData };
