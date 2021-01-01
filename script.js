// Global constant for time
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;


// Populate countdown / Complete UI
function updateDOM(elementSel, countState) {
   countState.countdownActive = setInterval(() => {
      const now = new Date().getTime();
      const distance = countState.countdownValue - now;

      // Goes from days, hours, minutes, and seconds
      const countDownTimes = [ Math.floor(distance / DAY), 
         Math.floor((distance % DAY) / HOUR), 
         Math.floor((distance % HOUR) / MINUTE), 
         Math.floor((distance % MINUTE) / SECOND)
      ];

      // Hide input
      elementSel.inputContainer.hidden = true;

      // If the countdown has ended, show complete
      if(distance < 0) {
         elementSel.countdownEl.hidden = true;
         clearInterval(countState.countdownActive);
         elementSel.completeElInfo.textContent = `${countState.countdownTitle} finished on ${countState.countdownDate}`;
         elementSel.completeEl.hidden = false;
      } else {
         // Populating countdown
         elementSel.countdownElTitle.textContent = `${countState.countdownTitle}`;
         [...elementSel.timeEls].forEach((timeEl, i) => timeEl.textContent = `${countDownTimes[i]}`);
         
         // Hide complete and Show countdown
         elementSel.completeEl.hidden = true;
         elementSel.countdownEl.hidden = false;
      }
   }, SECOND);
}

// Reset all values
function reset(elementSel, countState) {
   // Hide countdowns, show input
   elementSel.countdownEl.hidden = true;
   elementSel.completeEl.hidden = true;
   elementSel.inputContainer.hidden = false;
   // Stop the countdown
   clearInterval(countState.countdownActive);
   // Reset valuse
   countState.countdownTitle = '';
   countState.countdownDate = '';

   // Remove local storage
   localStorage.removeItem('countdown');
}

// Countdown update for form submission
function updateCountdown(elementSel, countState, event) {
   event.preventDefault();
   countState.countdownTitle = event.srcElement[0].value;
   countState.countdownDate = event.srcElement[1].value;

   // Store state on local storage
   const {countdownTitle, countdownDate} = {...countState};
   localStorage.setItem('countdown', JSON.stringify({countdownTitle, countdownDate}));

   // Check for valid date
   if(countdownDate === ''){
      alert('Please select a date for countdown.')
   } else {
      // Get number of current date and update DOM
      countState.countdownValue = new Date(countdownDate).getTime();
      updateDOM(elementSel, countState);
   }
}

function restorePrevCount(elementSel, countState) {
   if(localStorage.getItem('countdown')) {
      elementSel.inputContainer.hidden = true;
      const storedCount = JSON.parse(localStorage.getItem('countdown'));
      Object.keys(storedCount).forEach(key => countState[key] = storedCount[key]);
      countState.countdownValue = new Date(countState.countdownDate).getTime();
      updateDOM(elementSel, countState);
   }
}

function main() {
   // Object of element selectors
   const elementSel = {
      inputContainer : document.getElementById('input-container'),
      countdownForm : document.getElementById('countdownform'),
      dateEl : document.getElementById('date-picker'),
      countdownEl : document.getElementById('countdown'),
      countdownBtn : document.getElementById('countdown-button'),
      countdownElTitle : document.getElementById('countdown-title'),
      timeEls : document.querySelectorAll('#countdown ul li span'),
      completeEl : document.getElementById('complete'),
      completeElInfo : document.getElementById('complete-info'),
      completeBtn : document.getElementById('complete-button')
   };
   // lock selectors
   Object.freeze(elementSel);

   // Countdown state
   const countState = {
      countdownTitle : '',
      countdownDate : '',
      countdownValue : new Date(),
      countdownActive : setInterval
   }

   // Set min date base on current date
   const currentDate = new Date().toISOString().split('T')[0];
   elementSel.dateEl.setAttribute('min', currentDate);

   // Event Listeners
   elementSel.countdownForm.addEventListener('submit', event => updateCountdown(elementSel, countState, event));
   elementSel.countdownBtn.addEventListener('click', () => reset(elementSel, countState));
   elementSel.completeBtn.addEventListener('click', () => reset(elementSel, countState));

   // On-load check localstorage
   restorePrevCount(elementSel, countState);
}

main();