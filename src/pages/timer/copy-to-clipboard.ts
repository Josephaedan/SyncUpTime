const copyButton = document.getElementById("copy-button") as HTMLButtonElement;
var clicked = false;
copyButton.addEventListener("click", function (e) {
  // Copy URL to clipboard
  navigator.clipboard.writeText(window.location.href);
  copyButton.innerText = "Copied!";
  copyButton.dataset.status = "clicked";
  setTimeout(function () {
    if (clicked) {
      return;
    }
    clicked = true;
    copyButton.innerText = "Share";
    copyButton.dataset.status = "idle";
  }, 2000);
  clicked = false;
});
