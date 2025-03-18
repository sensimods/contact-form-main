  const contactForm = document.getElementById('contactForm');
  
  const errorMessages = {
    firstName: 'This field is required',
    lastName: 'This field is required',
    email: 'Please enter a valid email address',
    queryType: 'Please select a query type',
    message: 'This field is required',
    consent: 'To submit this form, please consent to being contacted'
  };

  const toast = document.getElementById('toast')

  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    
    const formElements = contactForm.elements;
    const { firstName, lastName, email, message, consent } = formElements;
    const selectedQueryType = document.querySelector('input[name="queryType"]:checked');
    
    [firstName, lastName, email, message].forEach(input => {
      isValid = validateInput(input) && isValid;
    });
    
    const queryTypeErrorSpan = document.getElementById('queryTypeError');
    if (!selectedQueryType) {
      queryTypeErrorSpan.textContent = errorMessages.queryType;
      queryTypeErrorSpan.classList.remove('hidden');
      isValid = false;
    } else {
      queryTypeErrorSpan.textContent = '';
      queryTypeErrorSpan.classList.add('hidden');
    }
    
    const consentErrorSpan = document.getElementById('consentError');
    if (!consent.checked) {
      consentErrorSpan.textContent = errorMessages.consent;
      consentErrorSpan.classList.remove('hidden');
      isValid = false;
    } else {
      consentErrorSpan.textContent = '';
      consentErrorSpan.classList.add('hidden');
    }
    
    if (isValid) { 
      showToast()
      // Form submission logic would go here
    }
  });
  
  function validateInput(input) {
    const errorSpan = document.getElementById(`${input.name}Error`);
    
    let isInputValid = true;
    
    if (!input.value) {
      isInputValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      isInputValid = false;
    }
    
    if (!isInputValid) {
      input.setAttribute("aria-invalid", "true");
      errorSpan.textContent = errorMessages[input.name];
      errorSpan.classList.remove('hidden');
      return false;
    } else {
      input.removeAttribute("aria-invalid");
      errorSpan.textContent = '';
      errorSpan.classList.add('hidden');
      return true;
    }
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function hasVisibleErrors() {
    return document.querySelectorAll('.error-message:not(.hidden)').length > 0;
  }
  
  const handleInputEvent = (element) => {
    if (hasVisibleErrors()) {
      const errorSpan = document.getElementById(`${element.name}Error`);
      
      element.removeAttribute('aria-invalid');
      
      if (element.type === 'email') {
        if (isValidEmail(element.value)) {
          errorSpan.textContent = '';
          errorSpan.classList.add('hidden');
        }
        return;
      }
      
      if (element.value) {
        errorSpan.textContent = '';
        errorSpan.classList.add('hidden');
      }
    }
  };
  
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => handleInputEvent(input));
    input.addEventListener('focus', function() {
      if (hasVisibleErrors()) {
        this.removeAttribute('aria-invalid');
      }
    });
  });
  
  const radioInputs = document.querySelectorAll('input[name="queryType"]');
  radioInputs.forEach(radio => {
    radio.addEventListener('change', function() {
      if (hasVisibleErrors()) {
        const errorSpan = document.getElementById('queryTypeError');
        errorSpan.textContent = '';
        errorSpan.classList.add('hidden');
      }
    });
  });
  
  const consentCheckbox = document.getElementById('consent');
  consentCheckbox.addEventListener('change', function() {
    if (hasVisibleErrors()) {
      const errorSpan = document.getElementById('consentError');
      if (this.checked) {
        errorSpan.textContent = '';
        errorSpan.classList.add('hidden');
      }
    }
  });


  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeToast();
    }
  });
  

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  
  const previousFocus = document.activeElement;
  
  const closeButton = toast.querySelector('.toast-close');
  if (closeButton) closeButton.focus();
  
  setTimeout(() => {
    closeToast();
    if (previousFocus) previousFocus.focus();
  }, 5000);
}

function closeToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('show');
  resetContactForm()
}

function resetContactForm () {
  contactForm.reset()
}