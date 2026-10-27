const STORAGE_KEY = "quality-safety-equipment-check-draft";
const form = document.querySelector("#equipment-form");
const extraItems = document.querySelector("#extra-items");
const saveStatus = document.querySelector("#save-status");

// Keep an in-progress check on this device so it can be resumed in the same browser.
function readDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Could not read the equipment check draft.", error);
    saveStatus.textContent = "Could not load the saved draft from this browser.";
    return null;
  }
}

function saveDraft() {
  const draft = {
    skillset: form.elements.skillset.value,
    checkedBy: form.elements["checked-by"].value,
    checkDate: form.elements["check-date"].value,
    extraItems: [...extraItems.querySelectorAll(".extra-item")].map((item) => ({
      name: item.querySelector('[data-field="name"]').value,
      serial: item.querySelector('[data-field="serial"]').value,
      date: item.querySelector('[data-field="date"]').value,
      notes: item.querySelector('[data-field="notes"]').value,
    })),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    saveStatus.textContent = "Draft is saved on this device.";
  } catch (error) {
    console.error("Could not save the equipment check draft.", error);
    saveStatus.textContent = "Could not save the draft. Check browser storage is available.";
  }
}

function createField(labelText, fieldName, type, value = "") {
  const label = document.createElement("label");
  label.append(document.createTextNode(labelText));

  const input = document.createElement(type === "textarea" ? "textarea" : "input");
  input.dataset.field = fieldName;

  if (type === "textarea") {
    input.rows = 2;
  } else {
    input.type = type;
  }

  input.value = value;
  label.append(input);
  return label;
}

function addExtraItem(item = {}) {
  const card = document.createElement("section");
  const itemNumber = extraItems.children.length + 1;
  card.className = "extra-item";

  const header = document.createElement("div");
  header.className = "extra-item-header";

  const title = document.createElement("h4");
  title.textContent = `Extra item ${itemNumber}`;

  const removeButton = document.createElement("button");
  removeButton.className = "remove-item";
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", `Remove extra item ${itemNumber}`);
  removeButton.addEventListener("click", () => {
    card.remove();
    refreshExtraItemNumbers();
    saveDraft();
  });

  header.append(title, removeButton);

  const fields = document.createElement("div");
  fields.className = "item-fields";
  fields.append(
    createField("Equipment item", "name", "text", item.name),
    createField("Serial number", "serial", "text", item.serial),
    createField("Item check date", "date", "date", item.date),
  );

  const notes = createField("Notes (optional)", "notes", "textarea", item.notes);
  notes.classList.add("notes-field");
  fields.append(notes);
  card.append(header, fields);
  // Extra entries are appended after the fixed skillset checklist when that is configured.
  extraItems.append(card);
}

function refreshExtraItemNumbers() {
  extraItems.querySelectorAll(".extra-item").forEach((item, index) => {
    const number = index + 1;
    item.querySelector("h4").textContent = `Extra item ${number}`;
    item.querySelector(".remove-item").setAttribute("aria-label", `Remove extra item ${number}`);
  });
}

function restoreDraft() {
  const draft = readDraft();
  if (!draft || typeof draft !== "object") {
    return;
  }

  form.elements.skillset.value = draft.skillset || "";
  form.elements["checked-by"].value = draft.checkedBy || "";
  form.elements["check-date"].value = draft.checkDate || "";

  if (Array.isArray(draft.extraItems)) {
    draft.extraItems.forEach((item) => addExtraItem(item));
  }
}

function csvCell(value) {
  const text = String(value ?? "");
  const safeText = /^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

function exportCsv() {
  const rows = [
    ["Skillset", form.elements.skillset.value],
    ["Checked by", form.elements["checked-by"].value],
    ["Check date", form.elements["check-date"].value],
    [],
    ["Item type", "Equipment item", "Serial number", "Item check date", "Notes"],
  ];

  extraItems.querySelectorAll(".extra-item").forEach((item) => {
    rows.push([
      "Extra",
      item.querySelector('[data-field="name"]').value,
      item.querySelector('[data-field="serial"]').value,
      item.querySelector('[data-field="date"]').value,
      item.querySelector('[data-field="notes"]').value,
    ]);
  });

  // The byte-order mark helps Excel recognise UTF-8 text when opening the CSV.
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  const date = form.elements["check-date"].value || new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `equipment-check-${date}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

form.addEventListener("input", saveDraft);
document.querySelector("#add-item").addEventListener("click", () => {
  addExtraItem();
  saveDraft();
});
document.querySelector("#export-csv").addEventListener("click", exportCsv);
document.querySelector("#clear-draft").addEventListener("click", () => {
  if (!window.confirm("Clear the saved equipment check draft from this device?")) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    form.reset();
    extraItems.replaceChildren();
    saveStatus.textContent = "Saved draft cleared from this device.";
  } catch (error) {
    console.error("Could not clear the equipment check draft.", error);
    saveStatus.textContent = "Could not clear the saved draft.";
  }
});

restoreDraft();
