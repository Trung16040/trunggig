const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".menu");
const menuClose = document.querySelector(".menu-close");

function setMenu(open) {
  menu.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  if (open) menu.querySelector("a").focus();
}

menuButton.addEventListener("click", () => setMenu(true));
menuClose.addEventListener("click", () => setMenu(false));

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

const emailConfig = {
  publicKey: "54Fq8vUWR4Eqcnm8P",
  serviceId: "service_ruzr5qw",
  templateId: "template_6ifk8nb",
};

const rsvpOpen = document.querySelector("#rsvp-open");
const rsvpDialog = document.querySelector("#rsvp-dialog");
const rsvpClose = document.querySelector("#rsvp-close");
const rsvpForm = document.querySelector("#rsvp-form");
const rsvpName = document.querySelector("#rsvp-name");
const rsvpError = document.querySelector("#rsvp-error");
const rsvpConfirmation = document.querySelector("#rsvp-confirmation");
const rsvpSubmit = rsvpForm.querySelector('button[type="submit"]');
const rsvpFields = rsvpForm.querySelectorAll("input, textarea");
let rsvpSending = false;
let rsvpBackdropPressed = false;

function isOutsideRsvpDialog(event) {
  const bounds = rsvpDialog.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
}

rsvpOpen.addEventListener("click", () => {
  rsvpConfirmation.hidden = true;
  rsvpError.hidden = true;
  rsvpDialog.showModal();
  rsvpName.focus();
});

rsvpClose.addEventListener("click", () => rsvpDialog.close());
rsvpDialog.addEventListener("pointerdown", (event) => {
  rsvpBackdropPressed = event.target === rsvpDialog && isOutsideRsvpDialog(event);
});
rsvpDialog.addEventListener("click", (event) => {
  if (!rsvpSending && rsvpBackdropPressed && event.target === rsvpDialog && isOutsideRsvpDialog(event)) {
    rsvpDialog.close();
  }
  rsvpBackdropPressed = false;
});
rsvpDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !rsvpSending) {
    event.preventDefault();
    rsvpDialog.close();
  }
});
rsvpDialog.addEventListener("cancel", (event) => {
  if (rsvpSending) event.preventDefault();
});

rsvpName.addEventListener("input", () => rsvpName.setCustomValidity(""));
rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (rsvpSending) return;

  const formData = new FormData(rsvpForm);
  const name = formData.get("guest_name").trim();
  if (!name) {
    rsvpName.setCustomValidity("Vui lòng nhập tên của bạn.");
    rsvpName.reportValidity();
    return;
  }
  rsvpError.hidden = true;
  if (Object.values(emailConfig).some((value) => !value.trim() || value.startsWith("YOUR_")) || !window.emailjs) {
    rsvpError.textContent = "Chưa thể gửi xác nhận. Vui lòng liên hệ trực tiếp với cô dâu chú rể.";
    rsvpError.hidden = false;
    console.error("EmailJS is not configured or could not be loaded.");
    return;
  }

  rsvpSending = true;
  rsvpSubmit.disabled = true;
  rsvpClose.disabled = true;
  rsvpFields.forEach((field) => { field.disabled = true; });
  rsvpSubmit.textContent = "Đang gửi...";

  try {
    await window.emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
      guest_name: name,
      attendance: formData.get("attendance"),
      notes: formData.get("notes").trim(),
    }, { publicKey: emailConfig.publicKey });
    rsvpForm.reset();
    rsvpDialog.close();
    rsvpConfirmation.textContent = "Cảm ơn bạn đã gửi xác nhận!";
    rsvpConfirmation.hidden = false;
  } catch (error) {
    console.error("RSVP email could not be sent:", error);
    rsvpError.textContent = "Không thể gửi xác nhận. Vui lòng thử lại hoặc liên hệ trực tiếp với cô dâu chú rể.";
    rsvpError.hidden = false;
  } finally {
    rsvpSending = false;
    rsvpSubmit.disabled = false;
    rsvpClose.disabled = false;
    rsvpFields.forEach((field) => { field.disabled = false; });
    rsvpSubmit.textContent = "Gửi xác nhận";
  }
});
