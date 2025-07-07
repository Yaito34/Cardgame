// Load UI elements from external HTML (like modals and tooltips)
window.addEventListener('DOMContentLoaded', () => {
  fetch('ui-snippets.html')
    .then(res => res.text())
    .then(html => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.append(...temp.children);

      // Activate UI interactivity after HTML is injected
      setupTooltips();
      setupModal();
    })
    .catch(err => console.error('❌ UI Snippets failed:', err));
});


// Tooltip logic for all .item elements
function setupTooltips() {
  const tooltip = document.getElementById("customTooltip");

  if (!tooltip) return;

  document.body.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("item")) {
      tooltip.innerText = e.target.getAttribute("data-tooltip") || "";
      tooltip.style.display = "block";
    }
  });

  document.body.addEventListener("mousemove", (e) => {
    if (tooltip.style.display === "block") {
      const offset = 12;
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let left = e.pageX + offset;
      let top = e.pageY + offset;

      if (left + tooltipWidth > screenWidth) {
        left = e.pageX - tooltipWidth - offset;
      }
      if (top + tooltipHeight > screenHeight) {
        top = e.pageY - tooltipHeight - offset;
      }

      tooltip.style.left = `${Math.max(left, 4)}px`;
      tooltip.style.top = `${Math.max(top, 4)}px`;
    }
  });

  document.body.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("item")) {
      tooltip.style.display = "none";
    }
  });
}


// Modal popup logic (like clicking an i-item for description)
function setupModal() {
  const overlay = document.getElementById("modalOverlay");
  const modalText = document.getElementById("modalText");

  if (!overlay || !modalText) return;

  window.openModal = (htmlContent) => {
    modalText.innerHTML = htmlContent;
    overlay.style.display = "flex";
  };

  window.closeModal = () => {
    overlay.style.display = "none";
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
}


// Navigate to a different page by name
function goTo(pageName) {
  window.location.href = `${pageName}.html`;
}


// Tooltip logic
document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("customTooltip");

  document.body.addEventListener("mouseover", function (e) {
    if (e.target.classList.contains("item")) {
      const text = e.target.getAttribute("data-tooltip");
      tooltip.innerText = text;
      tooltip.style.display = "block";

      // Temporarily place off-screen to measure size
      tooltip.style.left = "-9999px";
      tooltip.style.top = "-9999px";
      requestAnimationFrame(() => positionTooltip(e));
    }
  });

  document.body.addEventListener("mousemove", function (e) {
    if (tooltip.style.display === "block") {
      positionTooltip(e);
    }
  });

  document.body.addEventListener("mouseout", function (e) {
    if (e.target.classList.contains("item")) {
      tooltip.style.display = "none";
    }
  });

  function positionTooltip(e) {
    const offset = 10;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let left = e.pageX + offset;
    let top = e.pageY + offset;

    if (left + tooltipWidth > screenWidth) {
      left = e.pageX - tooltipWidth - offset;
    }
    if (top + tooltipHeight > screenHeight) {
      top = e.pageY - tooltipHeight - offset;
    }

    // Prevent going off screen on top/left
    if (left < 0) left = offset;
    if (top < 0) top = offset;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
});


  document.body.addEventListener("mouseout", function (e) {
    if (e.target.classList.contains("item")) {
      tooltip.style.display = "none";
    }
  });

function openModal(content) {
  const modal = document.getElementById("modalOverlay");
  const body = document.getElementById("modalBody");
  body.innerHTML = content;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}

// Close on outside click
window.addEventListener("click", function (e) {
  const modal = document.getElementById("modalOverlay");
  const content = document.getElementById("modalContent");
  if (e.target === modal) {
    closeModal();
  }
});

function renderParagraphSlots() {
  const container = document.getElementById('paragraph-slots');
  container.innerHTML = '';
  (window.paragraphSlots || []).filter(slot => slot.show).forEach(slot => {
    const div = document.createElement('div');
    div.innerHTML = slot.html;
    container.appendChild(div);
  });
}