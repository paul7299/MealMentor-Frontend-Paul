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
  const workoutsPerWeek = document.getElementById('activity-level').value;


  // meal checklist
  const mealChecklistDiv = document.getElementById('mealChecklistDiv').value;
  let selectedMeals = [];

    
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
  const goals = document.getElementById('goals').value;
  

  // Combining all values to create JSON
  const fullUserInput = {
    ageValue,
    sexValue,
    weightValue,
    workoutsPerWeek,
    selectedMeals,
    goals,
    //preferences,
  }
// POST or get?
  const response = await fetch(SERVER_URL, makeOptions("POST", fullUserInput, true));

  // *** Vi er her

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

  function addPreference(event) {
    if (event.target.value.length === 1) {
      const inputContainer = document.getElementById('input-container');
      const newInput = document.createElement('input');
      newInput.type = 'text';
      newInput.placeholder = 'Enter a preference/allergy';
      inputContainer.appendChild(newInput);
      newInput.addEventListener('input', addPreference);
    }
  }
  
  document.getElementById('preference-input').addEventListener('input', addPreference);  
}

