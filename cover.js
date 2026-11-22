const invitationLink = document.querySelector(".cover-button");
let openingTimer;

window.addEventListener("pageshow", () => {
  clearTimeout(openingTimer);
  document.body.classList.remove("is-opening");
});

invitationLink.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  event.preventDefault();
  if (document.body.classList.contains("is-opening")) return;
  document.body.classList.add("is-opening");
  openingTimer = setTimeout(() => {
    window.location.assign(invitationLink.href);
  }, 250);
});
