const STORAGE_KEY = "quality-safety-equipment-check-draft";
const form = document.querySelector("#equipment-form");
const extraItems = document.querySelector("#extra-items");
const checklistItems = document.querySelector("#checklist-items");
const saveStatus = document.querySelector("#save-status");
const skillsetSelect = document.querySelector("#skillset");
const templateTitle = document.querySelector("#template-title");
const templateMessage = document.querySelector("#template-message");
let checklistValues = {};

const CONDITION_OPTIONS = ["Fit for Use", "Not Fit for Use", "Not Witnessed"];
const YES_NO_OPTIONS = ["Yes", "No"];

function conditionField() {
  return { id: "condition", label: "Condition", type: "select", options: CONDITION_OPTIONS };
}

function quantityField(label = "Quantity") {
  return { id: "quantity", label, type: "number", min: 0, step: 1 };
}

function manufacturerDateField() {
  return { id: "manufacturerDate", label: "Manufacturer date", type: "date" };
}

function serialNumberField() {
  return { id: "serialNumber", label: "Serial number", type: "text" };
}

function commentsField() {
  return { id: "comments", label: "Comments", type: "textarea" };
}

const BB_ITEMS = [
  { id: "10mm-eyebolt", name: "10mm Eyebolt", fields: [quantityField()] },
  { id: "karabiners", name: "Karabiner(s)", fields: [quantityField()] },
  { id: "ladder-mats", name: "Ladder Mats", fields: [conditionField()] },
  { id: "floodlight", name: "Floodlight", fields: [conditionField()] },
  { id: "floodlight-type", name: "Floodlight Type", fields: [{ id: "type", label: "Type", type: "select", options: ["Draper", "Peli", "MS14", "Not Witnessed"] }] },
  { id: "over-ear-protection", name: "Over Ear Protection", fields: [conditionField()] },
  { id: "in-ear-protection", name: "In Ear Protection", fields: [conditionField()] },
  { id: "eye-protection-goggles", name: "Eye Protection Goggles", fields: [conditionField()] },
  { id: "eye-protection-shield-safety-specs", name: "Eye Protection Shield/Safety Specs", fields: [conditionField()] },
  { id: "knee-pads", name: "Knee Pads", fields: [conditionField()] },
  { id: "high-visibility-vest", name: "High Visibility Vest", fields: [conditionField()] },
  { id: "dust-mask", name: "Dust Mask", fields: [conditionField()] },
  { id: "dust-mask-number-available", name: "Dust Mask Number Available On Van", fields: [quantityField()] },
  { id: "drill-harness-auxiliary-handle", name: "Drill Harness and Auxiliary Handle", fields: [conditionField()] },
  { id: "wire-pipe-detector", name: "Wire and Pipe Detector", fields: [conditionField()] },
  { id: "spare-batteries", name: "Spare Batteries 9v and AA (If new Bosch detector present)", fields: [conditionField()] },
  { id: "first-aid-kit", name: "First Aid Kit", fields: [conditionField()] },
  { id: "combination-ladder", name: "Combination Ladder", fields: [conditionField()] },
  { id: "hop-up", name: "Hop Up", fields: [conditionField()] },
  { id: "safety-boots", name: "Safety Boots", fields: [conditionField()] },
  {
    id: "harness",
    name: "Harness",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  {
    id: "hard-hat",
    name: "Hard Hat",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  {
    id: "high-value-kit-inventory",
    name: "Does engineer have all high-value kit scanned to their inventory?",
    fields: [{ id: "answer", label: "Answer", type: "select", options: YES_NO_OPTIONS }, commentsField()],
  },
  {
    id: "continuous-loop-webbing-sling",
    name: "Continuous Loop Webbing Sling",
    fields: [quantityField("Quantity fit for use"), commentsField()],
  },
  {
    id: "1m-ratchet-strap",
    name: "1m Ratchet Strap",
    fields: [quantityField("Quantity fit for use"), commentsField()],
  },
  {
    id: "2m-ratchet-strap",
    name: "2m Ratchet Strap",
    fields: [quantityField("Quantity fit for use"), commentsField()],
  },
  {
    id: "4m-ratchet-strap",
    name: "4m Ratchet Strap",
    fields: [quantityField("Quantity fit for use"), commentsField()],
  },
];

const DTV_ITEMS = [
  {
    id: "cowstail",
    name: "Cowstail",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  {
    id: "15m-rope",
    name: "15m Rope",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  {
    id: "10m-rope",
    name: "10m Rope",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  {
    id: "5m-rope",
    name: "5m Rope",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  {
    id: "chimney-strop-adjustable-anchor-strap",
    name: "Chimney Strop/Adjustable Anchor Strap",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  { id: "10m-ratchet-strap", name: "10m Ratchet Strap", fields: [conditionField(), commentsField()] },
  {
    id: "soft-sling",
    name: "Soft Sling",
    fields: [quantityField("Quantity fit for use"), commentsField()],
  },
  { id: "rope-grab", name: "Rope Grab", fields: [conditionField()] },
  { id: "ladder-mate", name: "Ladder Mate", fields: [conditionField()] },
  { id: "microlite", name: "Microlite", fields: [conditionField()] },
  {
    id: "cones",
    name: "Cones fit for use (2 if DTV / 12 if PTTP)",
    fields: [quantityField("Quantity fit for use")],
  },
  { id: "crawl-board", name: "Crawl Board", fields: [quantityField("Quantity fit for use")] },
  { id: "20mm-eyebolt", name: "20mm Eyebolt", fields: [quantityField("Quantity fit for use")] },
  { id: "triple-ladder", name: "Triple Ladder", fields: [conditionField()] },
  {
    id: "dtv-ladder-type",
    name: "What Type of Ladder? 10/12/14 Rung?",
    fields: [{ id: "type", label: "Ladder type", type: "select", options: ["10 Rung", "12 Rung", "14 Rung"] }],
  },
  { id: "roof-ladder", name: "Roof Ladder", fields: [conditionField()] },
];

const SAT_ITEMS = [
  {
    id: "50m-rope",
    name: "50m Rope",
    fields: [conditionField(), manufacturerDateField(), serialNumberField()],
  },
  {
    id: "safety-ascender-descender-device",
    name: "Safety Ascender/Descender Device (Belay Device)",
    fields: [conditionField(), serialNumberField()],
  },
  { id: "rocker", name: "Rocker", fields: [conditionField(), serialNumberField()] },
  {
    id: "wire-rope-slings",
    name: "Wire Rope Slings",
    fields: [quantityField("Quantity fit for use"), commentsField()],
  },
  { id: "sat-harness", name: "Sat Harness", fields: [conditionField(), commentsField()] },
  { id: "sat-helmet", name: "Sat Helmet", fields: [conditionField(), commentsField()] },
  { id: "30m-static-accessory-cord", name: "30m x 7mm Static Acc. Cord", fields: [conditionField()] },
  { id: "delta-mailon", name: "Delta Mailon", fields: [conditionField()] },
  { id: "rope-protector", name: "Rope Protector", fields: [quantityField("Quantity fit for use")] },
  { id: "pulley-block", name: "Pulley Block", fields: [quantityField("Quantity fit for use")] },
  { id: "dat-ladder-two-sections", name: "DAT Ladder (Two Sections)", fields: [conditionField()] },
  { id: "dat-ladder-clamp", name: "DAT Ladder Clamp", fields: [conditionField()] },
  { id: "dat-spreader-bar", name: "DAT Spreader Bar x 2", fields: [conditionField()] },
  { id: "safety-knife", name: "Safety Knife", fields: [conditionField()] },
  { id: "se-kit-bag", name: "SE Kit Bag", fields: [conditionField()] },
  { id: "additional-14-rung-triple-ladder", name: "Additional 14 Rung Triple Ladder", fields: [conditionField()] },
  {
    id: "additional-rope-assisted-triple-ladder",
    name: "Additional Rope Assisted Triple Ladder",
    fields: [conditionField()],
  },
  {
    id: "sat-ladder-type",
    name: "What Type of Ladder? 15/17/19 Rung?",
    fields: [{ id: "type", label: "Ladder type", type: "select", options: ["15 Rung", "17 Rung", "19 Rung", "None"] }],
  },
];

const CHECKLIST_TEMPLATES = {
  BB: BB_ITEMS,
  DTV: [...BB_ITEMS, ...DTV_ITEMS],
  SAT: [...BB_ITEMS, ...DTV_ITEMS, ...SAT_ITEMS],
};

function collectChecklistValues() {
  checklistItems.querySelectorAll(".checklist-item").forEach((item) => {
    const itemValues = checklistValues[item.dataset.itemId] || {};
    item.querySelectorAll("[data-checklist-field]").forEach((field) => {
      itemValues[field.dataset.checklistField] = field.value;
    });
    checklistValues[item.dataset.itemId] = itemValues;
  });
  return checklistValues;
}

function updateConditionDependentFields(card) {
  const condition = card.querySelector('[data-checklist-field="condition"]');
  if (!condition) {
    return;
  }

  const isNotApplicable = condition.value === "Not Fit for Use" || condition.value === "Not Witnessed";
  const values = checklistValues[card.dataset.itemId] || {};

  card.querySelectorAll("[data-checklist-field]").forEach((field) => {
    if (field === condition) {
      return;
    }

    const label = field.closest("label");
    field.disabled = isNotApplicable;
    field.required = !isNotApplicable && field.dataset.required === "true";
    label.hidden = isNotApplicable;

    if (isNotApplicable) {
      field.value = "";
      values[field.dataset.checklistField] = "";
    }
  });

  checklistValues[card.dataset.itemId] = values;
}

function createChecklistField(item, field, value = "") {
  const label = document.createElement("label");
  label.append(document.createTextNode(field.label));
  let control;

  if (field.type === "select") {
    control = document.createElement("select");
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose an option";
    control.append(placeholder);
    field.options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      control.append(optionElement);
    });
  } else if (field.type === "textarea") {
    control = document.createElement("textarea");
    control.rows = 2;
  } else {
    control = document.createElement("input");
    control.type = field.type;
    if (field.min !== undefined) control.min = field.min;
    if (field.step !== undefined) control.step = field.step;
  }

  control.value = value;
  control.dataset.checklistField = field.id;
  control.dataset.itemId = item.id;
  control.required = field.type !== "textarea";
  control.dataset.required = String(control.required);
  label.append(control);
  return label;
}

function renderChecklist(items) {
  checklistItems.replaceChildren();

  items.forEach((item) => {
    const card = document.createElement("section");
    card.className = "checklist-item";
    card.dataset.itemId = item.id;

    const heading = document.createElement("h3");
    heading.textContent = item.name;
    const fields = document.createElement("div");
    fields.className = "checklist-fields";
    const values = checklistValues[item.id] || {};

    item.fields.forEach((field) => {
      fields.append(createChecklistField(item, field, values[field.id] || ""));
    });

    card.append(heading, fields);
    checklistItems.append(card);
    updateConditionDependentFields(card);
  });
}

function updateChecklistTemplate() {
  collectChecklistValues();
  const skillset = skillsetSelect.value;

  if (!skillset) {
    templateTitle.textContent = "Choose a skillset";
    templateMessage.textContent = "Choose BB, DTV, or SAT to show the matching ordered checklist.";
    checklistItems.replaceChildren();
    return;
  }

  const template = CHECKLIST_TEMPLATES[skillset];
  templateTitle.textContent = `${skillset} checklist`;
  templateMessage.textContent = `${template.length} equipment items. Every selection and quantity is required.`;
  renderChecklist(template);
}

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
    engineerName: form.elements["engineer-name"].value,
    engineerTechNumber: form.elements["engineer-tech-number"].value,
    checkDate: form.elements["check-date"].value,
    checklist: collectChecklistValues(),
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

function createField(labelText, fieldName, type, value = "", required = true) {
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
  input.required = required;
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
    createField("Manufacturer date", "date", "date", item.date),
  );

  const notes = createField("Comments", "notes", "textarea", item.notes, false);
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

  form.elements.skillset.value = draft.skillset === "Broadband" ? "BB" : draft.skillset || "";
  checklistValues = draft.checklist && typeof draft.checklist === "object" ? draft.checklist : {};
  Object.values(checklistValues).forEach((values) => {
    if (values.manufacturerDate === "Yes" || values.manufacturerDate === "No") {
      values.manufacturerDate = "";
    }
    if (values.serialNumber === "Yes" || values.serialNumber === "No") {
      values.serialNumber = "";
    }
  });
  updateChecklistTemplate();
  form.elements["engineer-name"].value = draft.engineerName || draft.checkedBy || "";
  form.elements["engineer-tech-number"].value = draft.engineerTechNumber || "";
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
  if (!form.reportValidity()) {
    return;
  }

  const rows = [
    ["Skillset", form.elements.skillset.value],
    ["Engineer Name", form.elements["engineer-name"].value],
    ["Engineer Tech Number", form.elements["engineer-tech-number"].value],
    ["Check date", form.elements["check-date"].value],
    [],
    [
      "Item type",
      "Equipment item",
      "Quantity",
      "Condition",
      "Type",
      "Manufacturer date",
      "Serial number",
      "Answer",
      "Extra item serial number",
      "Extra item manufacturer date",
      "Comments",
    ],
  ];

  CHECKLIST_TEMPLATES[form.elements.skillset.value].forEach((item) => {
    const values = checklistValues[item.id] || {};
    rows.push([
      "Checklist",
      item.name,
      values.quantity || "",
      values.condition || "",
      values.type || "",
      values.manufacturerDate || "",
      values.serialNumber || "",
      values.answer || "",
      "",
      "",
      values.comments || "",
    ]);
  });

  extraItems.querySelectorAll(".extra-item").forEach((item) => {
    rows.push([
      "Extra",
      item.querySelector('[data-field="name"]').value,
      "",
      "",
      "",
      "",
      "",
      "",
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
form.addEventListener("change", (event) => {
  if (event.target === skillsetSelect) {
    updateChecklistTemplate();
  } else if (event.target.matches('[data-checklist-field="condition"]')) {
    updateConditionDependentFields(event.target.closest(".checklist-item"));
  }
  saveDraft();
});
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
    checklistValues = {};
    updateChecklistTemplate();
    saveStatus.textContent = "Saved draft cleared from this device.";
  } catch (error) {
    console.error("Could not clear the equipment check draft.", error);
    saveStatus.textContent = "Could not clear the saved draft.";
  }
});

restoreDraft();
