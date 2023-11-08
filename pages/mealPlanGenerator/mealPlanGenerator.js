import { API_URL } from "../../settings.js";
import {
  sanitizeStringWithTableRows,
  handleHttpErrors,
  makeOptions,
} from "../../utils.js";

const SERVER_URL = API_URL + "/mealPlanGenerator";

export async function initMealPlanGenerator() {

  // user info
  const sexValue = document.getElementById('sex').value;
  const ageValue = document.getElementById('age').value;
  const weightValue = document.getElementById('weight').value;


  // meal checklist
  const mealChecklistDiv = document.getElementById('mealChecklist').value;
  let selectedMeals = [] 

    
  mealChecklistDiv.addEventListener('change', function() {
    var checkboxesList = mealChecklistDiv.querySelectorAll('input[type="checkbox"]')

      // itererer igennem checkboxene og lægger dem til selectedMeals hvis de er checked
    checkboxesList.foreach((mealType) => {
      if (mealType.checked) {
            selectedMeals.push(mealType.value)
      }
    })
  });


  // Preferences


  // Goals  
  


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


}


