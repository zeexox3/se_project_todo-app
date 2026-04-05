class FormValidator {
  constructor(settings, formEl) {
    this._settings = settings;
    this._formEl = formEl;
    this._inputList = Array.from(
      formEl.querySelectorAll(settings.inputSelector),
    );
    this._buttonEl = formEl.querySelector(settings.submitButtonSelector);
  }

  _hasInvalidInput() {
    return this._inputList.some((input) => !input.validity.valid);
  }

  _showInputError(input) {
    const errorElement = this._formEl.querySelector(`#${input.id}-error`);
    input.classList.add(this._settings.inputErrorClass);
    errorElement.textContent = input.validationMessage;
    errorElement.classList.add(this._settings.errorClass);
  }

  _hideInputError(input) {
    const errorElement = this._formEl.querySelector(`#${input.id}-error`);
    input.classList.remove(this._settings.inputErrorClass);
    errorElement.classList.remove(this._settings.errorClass);
    errorElement.textContent = "";
  }

  _checkInputValidity(input) {
    if (!input.validity.valid) {
      this._showInputError(input);
    } else {
      this._hideInputError(input);
    }
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._buttonEl.classList.add(this._settings.inactiveButtonClass);
      this._buttonEl.disabled = true;
    } else {
      this._buttonEl.classList.remove(this._settings.inactiveButtonClass);
      this._buttonEl.disabled = false;
    }
  }

  _setEventListeners() {
    this._toggleButtonState();

    this._inputList.forEach((input) => {
      input.addEventListener("input", () => {
        this._checkInputValidity(input);
        this._toggleButtonState();
      });
    });
  }

  enableValidation() {
    this._formEl.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });

    this._setEventListeners();
  }

  resetValidation() {
    this._formEl.reset();

    this._inputList.forEach((input) => {
      this._hideInputError(input);
    });

    this._toggleButtonState();
  }
}

export default FormValidator;
