import { API_URL } from "../../settings.js";
import {
  sanitizeStringWithTableRows,
  handleHttpErrors,
  makeOptions,
} from "../../utils.js";

const SERVER_URL = API_URL + "/meals/usersSavedMeals/";

export async function initUsersSavedMeals() {
  const username = localStorage.getItem("user");

  var savedMealsResponse = await fetch(
    SERVER_URL + username,
    makeOptions("GET", null, true)
  ).then(handleHttpErrors);

  document.getElementById("savedMealsDiv").innerHTML =
    createAccordians(savedMealsResponse);
}

function createAccordians(mealsResponse) {
  var accordionId = "savedMealsAccordian"; // A unique ID for the accordion
  var accordionHtml = `<div class="accordion" id="${accordionId}">`;
  var itemIndex = 0;

  if (mealsResponse.length == 0) {
    return "<p>You have not saved any meals</p>";
  }

  mealsResponse.forEach((meal) => {
    // Assuming meal is an object with properties like mealId, mealType, title, etc.
    accordionHtml += `
          <div class="accordion-item">
              <h2 class="accordion-header" id="heading${itemIndex}">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${itemIndex}" aria-expanded="false" aria-controls="collapse${itemIndex}">
              ${meal.title}
                  </button>
              </h2>
              <div id="collapse${itemIndex}" class="accordion-collapse collapse show" aria-labelledby="heading${itemIndex}" data-bs-parent="#${accordionId}">
                  <div class="accordion-body">
                  <ul>
                  <p>Meal Type: ${meal.mealType}</p>
                        <li>Instructions: ${meal.instructions}</li>
                        <li>Description: ${meal.description}</li>
                        <li>Calories: ${meal.calories}</li>
                        <li>Carbs: ${meal.carbs}</li>
                        <li>Fat: ${meal.fat}</li>
                        <li>Protein: ${meal.protein}</li>
                        <li>Time to Make: ${meal.timeToMake}</li>
                  
                      </ul>
                      <!-- Add more details as needed -->
                  </div>
              </div>
          </div>`;
    itemIndex++;
  });

  accordionHtml += `</div>`;
  return accordionHtml;
}
