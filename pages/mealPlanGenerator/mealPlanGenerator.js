import { API_URL } from "../../settings.js";
import {
  sanitizeStringWithTableRows,
  handleHttpErrors,
  makeOptions,
} from "../../utils.js";

const URL = API_URL + "/mealPlanGenerator";

export async function initMealPlanGenerator() {

}


document.addEventListener("DOMContentLoaded", function() {
  const itemList = document.getElementById("preference-list");
  const addItemButton = document.getElementById("add-preference");

  addItemButton.addEventListener("click", function() {
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.className = "form-control";

      itemList.appendChild(inputField);
  });
});
