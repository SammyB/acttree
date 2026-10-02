// Quote form (components/jotform-quote.njk).
// 1. JotForm's spam check expects simple_spc to be "<formID>-<formID>". Setting it from JS
//    (as JotForm's own embed does) means simple bots that don't run scripts fail the check.
// 2. Validation: the browser's bubbles show one field at a time and nothing turns red, so with JS
//    we validate ourselves: every invalid field gets a red border, a red label and a message under
//    it (linked with aria-describedby), a summary appears by the submit button, and focus moves to
//    the first problem. Errors update as the visitor fixes them. Without JS, the browser's own
//    validation (required, type="email", pattern) still runs.
const ERROR_CLASSES = ["mt-1", "text-sm", "font-semibold", "text-danger"];

function messageFor(field) {
  const { validity, dataset } = field;
  if (validity.valueMissing) return dataset.errorMissing || "This field is required.";
  if (validity.typeMismatch || validity.patternMismatch || validity.tooLong) {
    return dataset.errorFormat || "Check this field.";
  }
  return field.validationMessage;
}

function showError(field) {
  const label = field.form.querySelector(`label[for="${field.id}"]`);
  const errorId = `${field.id}-error`;
  let error = document.getElementById(errorId);
  const message = field.checkValidity() ? "" : messageFor(field);

  if (!message) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    label?.classList.remove("text-danger");
    error?.remove();
    return;
  }
  if (!error) {
    error = document.createElement("p");
    error.id = errorId;
    error.classList.add(...ERROR_CLASSES);
    field.after(error);
  }
  error.textContent = message;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", errorId);
  label?.classList.add("text-danger");
}

function updateSummary(form, invalid) {
  const summary = form.querySelector("[data-error-summary]");
  if (!summary) return;
  summary.hidden = invalid.length === 0;
  summary.textContent =
    invalid.length === 1
      ? "Please fix the field marked in red, then send your request again."
      : `Please fix the ${invalid.length} fields marked in red, then send your request again.`;
}

for (const form of document.querySelectorAll("form[data-jotform]")) {
  const token = form.querySelector("[data-spam-token]");
  if (token) token.value = `${form.dataset.jotform}-${form.dataset.jotform}`;

  form.noValidate = true; // we show the errors instead of the browser's bubbles
  const fields = [...form.elements].filter((el) => el.willValidate && el.id);
  let attempted = false;

  form.addEventListener("submit", (event) => {
    attempted = true;
    fields.forEach(showError);
    const invalid = fields.filter((field) => !field.checkValidity());
    updateSummary(form, invalid);
    if (invalid.length) {
      event.preventDefault();
      invalid[0].focus();
    }
  });

  // Before the first submit, only check a field when the visitor leaves it having typed something
  // (no red for fields they haven't reached). After it, re-check as they type so errors clear.
  for (const field of fields) {
    field.addEventListener("blur", () => {
      if (attempted || field.value) showError(field);
    });
    field.addEventListener(field.tagName === "SELECT" ? "change" : "input", () => {
      if (!attempted && !field.hasAttribute("aria-invalid")) return;
      showError(field);
      if (attempted) updateSummary(form, fields.filter((f) => !f.checkValidity()));
    });
  }
}
