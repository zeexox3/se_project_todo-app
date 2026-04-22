import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import TodoCounter from "../components/TodoCounter.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../utils/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopupEl.querySelector(".popup__form");

const normalizedTodos = initialTodos.map((todo) => ({
  ...todo,
  completed: todo.completed || false,
}));

const todoCounter = new TodoCounter(normalizedTodos, ".counter");

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: ({ name, date }) => {
    const parsedDate = date ? new Date(date) : null;

    if (parsedDate) {
      parsedDate.setMinutes(
        parsedDate.getMinutes() + parsedDate.getTimezoneOffset(),
      );
    }

    const id = uuidv4();

    addTodo({ name, date: parsedDate, id });

    formValidator.resetValidation();
    addTodoPopup.close();
  },
});

const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", {
    handleDelete: (isCompleted) => {
      todoCounter.updateTotal(false);
      if (isCompleted) {
        todoCounter.updateCompleted(false);
      }
    },
    handleToggle: (isNowCompleted) => {
      todoCounter.updateCompleted(isNowCompleted);
    },
  });

  return todo.getView();
};

const section = new Section({
  items: normalizedTodos,
  renderer: (item) => {
    return generateTodo(item);
  },
  containerSelector: ".todos__list",
});

section.renderItems();

const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();

addTodoPopup.setEventListeners();

const addTodo = (item) => {
  const todoElement = generateTodo({
    ...item,
    completed: false,
  });

  section.addItem(todoElement);
  todoCounter.updateTotal(true);
};

addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});
