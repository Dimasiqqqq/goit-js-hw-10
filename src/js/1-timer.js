import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast/dist/js/iziToast.min.js";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('[data-start]');
const dateTimePicker = document.querySelector('#datetime-picker');
let timerInterval;

// Визначення функції для перевірки, чи потрібно вимкнути кнопку "Start"
function checkStartButtonState() {
  const selectedDate = flatpickr.parseDate(dateTimePicker.value, "Y-m-d H:i");
  const currentDate = new Date();

  if (selectedDate <= currentDate) {
    startButton.disabled = true;
  } else {
    startButton.disabled = false;
  }
}

// Виклик функції при завантаженні сторінки
checkStartButtonState();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);
startButton.addEventListener('click', startTimer);

function startTimer() {
  const userSelectedDate = flatpickr.parseDate(dateTimePicker.value, "Y-m-d H:i");

  if (userSelectedDate <= new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    return;
  }

  // Перевірка, чи існує інтервал перед створенням нового
  if (timerInterval) {
    // Скидання попереднього таймера перед створенням нового
    clearInterval(timerInterval);
    timerInterval = undefined;
  }

  timerInterval = setInterval(() => updateTimer(userSelectedDate), 1000);

  // Початкове встановлення кнопки "Start" як неактивної при початку таймера
  startButton.disabled = true;
}

function updateTimer(userSelectedDate) {
  const timeLeft = userSelectedDate - new Date();

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    // Після закінчення таймера встановлюємо кнопку "Start" як активну
    startButton.disabled = false;
  } else {
    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateInterface({ days, hours, minutes, seconds });
  }
}

function updateInterface({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}