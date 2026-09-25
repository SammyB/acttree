// JotForm's spam check expects simple_spc to be "<formID>-<formID>". Setting it from JS
// (as JotForm's own embed does) means simple bots that don't run scripts fail the check.
for (const form of document.querySelectorAll("form[data-jotform]")) {
  const token = form.querySelector("[data-spam-token]");
  if (token) token.value = `${form.dataset.jotform}-${form.dataset.jotform}`;
}
