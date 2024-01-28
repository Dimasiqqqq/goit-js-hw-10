import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const delayInput = form.elements.delay;
    const stateInput = form.elements.state;

    const delay = parseInt(delayInput.value, 10);
    const state = stateInput.value;

    const notificationPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === "fulfilled") {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });

    notificationPromise
      .then((delay) => {
        iziToast.success({
          title: "Fulfilled Promise",
          message: `✅ Fulfilled promise in ${delay}ms`,
        });
      })
      .catch((delay) => {
        iziToast.error({
          title: "Rejected Promise",
          message: `❌ Rejected promise in ${delay}ms`,
        });
      });
  });
});