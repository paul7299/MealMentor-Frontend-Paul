import { API_URL } from "../../settings.js";
import {
  sanitizeStringWithTableRows,
  handleHttpErrors,
  makeOptions,
} from "../../utils.js";

const SERVER_URL = API_URL + "/mealPlanGenerator";








  
  
  export async function initMealPlanGenerator() {
    const aboutValue = document.getElementById('about').value;
    const mealTypeValue = document.getElementById('mealType').value;// Get the selected value from the dropdown
    const inputValues =  mealTypeValue + " " + aboutValue;
    console.log("meatype: " + mealTypeValue)
    console.log(inputValues)
    const URL1 = `${SERVER_URL}?mealType=${mealTypeValue}&about=${aboutValue}`;// Include the dropdown value in the "about" parameter
    const URL = `${SERVER_URL}?about=${inputValues}`;
    const spinner = document.getElementById('spinner1');
    const result = document.getElementById('result');
    result.style.color = "black";
    
  try {
    spinner.style.display = "block";
    const response = await fetch(URL).then(handleHttpErrors);
    document.getElementById('result').innerText = response.answer;
    //document.getElementById('about').value = '';
  } catch (e) {
    result.style.color = "red";
    result.innerText = e.message;
  } finally {
    spinner.style.display = "none";
  }
  const addItemButton = document.getElementById("add-preference");

addItemButton.addEventListener("click", function() {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Enter preference/allergy";
  
  // Add the input field to the itemList or another container.
  const itemList = document.getElementById("preference-list");
  itemList.appendChild(inputField);
});
}

