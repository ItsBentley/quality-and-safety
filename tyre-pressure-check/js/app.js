const wheelCards = document.querySelectorAll("[data-wheel]");

function updateWheel(card) {
  const recommendedInput = card.querySelector("[data-recommended]");
  const measuredInput = card.querySelector("[data-measured]");
  const percentageOutput = card.querySelector("[data-percentage]");
  const statusOutput = card.querySelector("[data-status]");
  const recommended = recommendedInput.valueAsNumber;
  const measured = measuredInput.valueAsNumber;
  const hasRecommended = recommendedInput.value !== "";
  const hasMeasured = measuredInput.value !== "";

  statusOutput.className = "status";

  if (!hasRecommended || !hasMeasured) {
    percentageOutput.textContent = "—";
    statusOutput.textContent = "Awaiting readings";
    statusOutput.classList.add("status-pending");
    return;
  }

  if (!Number.isFinite(recommended) || recommended <= 0 || !Number.isFinite(measured) || measured < 0) {
    percentageOutput.textContent = "—";
    statusOutput.textContent = !Number.isFinite(recommended) || recommended <= 0
      ? "Recommendation must be above 0"
      : "Check the readings";
    statusOutput.classList.add("status-pending");
    return;
  }

  const shortfall = Math.max(0, (recommended - measured) / recommended);
  const percentBelow = shortfall * 100;
  percentageOutput.textContent = `${percentBelow.toFixed(1)}%`;

  if (shortfall <= 0.10) {
    statusOutput.textContent = "PASS";
    statusOutput.classList.add("status-pass");
  } else if (shortfall < 0.25) {
    statusOutput.textContent = "ADVISORY";
    statusOutput.classList.add("status-advisory");
  } else {
    statusOutput.textContent = "FAIL";
    statusOutput.classList.add("status-fail");
  }
}

wheelCards.forEach((card) => {
  card.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => updateWheel(card));
  });
});
