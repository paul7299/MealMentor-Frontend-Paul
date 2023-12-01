import { API_URL } from "../../settings.js";
import {
  sanitizeStringWithTableRows,
  handleHttpErrors,
  makeOptions,
} from "../../utils.js";

const SERVER_URL = API_URL + "/mealPlanGenerator";

export async function initMealPlanGenerator() {
  document
    .getElementById("submit-button")
    .addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent the default form submission

      // Show the 'Please wait...' button and hide the 'SUBMIT' button
      document.getElementById("wait-button").style.display = "block";
      document.getElementById("submit-button").style.display = "none";

      // preferences
      let preferences = [];
      const preferenceContainer = document.getElementById("input-container");
      const preferencesInputs =
        preferenceContainer.querySelectorAll('input[type="text"]');
      preferencesInputs.forEach((p) => {
        if (p.value.trim().length > 0) {
          preferences.push(p.value);
        }
      });

      // meal checklist
      const mealChecklistDiv = document.getElementById("mealChecklistDiv");
      // itererer igennem checkboxene og lægger dem til selectedMeals hvis de er checked

      var checkboxesList = mealChecklistDiv.querySelectorAll(
        'input[type="checkbox"]'
      );
      let mealChecklist = [];
      checkboxesList.forEach((mealType) => {
        if (mealType.checked) {
          mealChecklist.push(mealType.value);
        }
      });

      const username = localStorage.getItem("user");
      console.log(username);

      // Combining all values to create JSON
      const fullUserInput = {
        username,
        mealChecklist,
        preferences,
      };

      //
      const response = await fetch(
        SERVER_URL,
        makeOptions("POST", fullUserInput, true)
      );

      if (response.ok) {
        const responseData = await response.json();

        var jsonString = responseData.answer;
        var myJsonObject = JSON.parse(jsonString);
        document.getElementById("jsonTable").innerHTML =
        createTable(myJsonObject);

        if (myJsonObject.hasOwnProperty('Breakfast')) {
          console.log(myJsonObject['Breakfast']); // Logs the 'Breakfast' object
      }    

        //alert("Answer from OpenAI received");

        document.getElementById("wait-button").style.display = "none";
        document.getElementById("submit-button").style.display = "block";
        return responseData;
      } else {
        document.getElementById("wait-button").style.display = "none";
        document.getElementById("submit-button").style.display = "block";
        const errorData = await response.json();

        document.getElementById("result").innerText =
        "* ERROR *";

        throw new Error(errorData.message);
      }

      
    });
  function addPreference(event) {
    if (event.target.value.length === 1) {
      const inputContainer = document.getElementById("input-container");
      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.placeholder = "Enter a preference/allergy";
      inputContainer.appendChild(newInput);
      newInput.addEventListener("input", addPreference);
    }
  }

  
  function createTable(JSONObject) {
    var tables = ""; // Variable to store all tables
  
    for (var key in JSONObject) {
      if (JSONObject.hasOwnProperty(key)) {
        var value = JSONObject[key];
  
        // Create a new table for each recipe
        var table = "<table border='1'>";
        table += "<tr><td colspan='2'><b>" + key + "</b></td></tr>";
  
        if (Array.isArray(value)) {
          // Handle array elements by concatenating them into a single cell
          table += "<tr><td colspan='2'>" + value.join(', ') + "</td></tr>";
        } else if (typeof value === "object" && value !== null) {
          // Create rows for each detail within the same table
          for (var detailKey in value) {
            if (value.hasOwnProperty(detailKey)) {
              var detailValue = value[detailKey];
              table += "<tr><td>" + detailKey + "</td><td>" + detailValue + "</td></tr>";
            }
          }
        } else {
          // Handle normal elements
          table += "<tr><td colspan='2'>" + value + "</td></tr>";
        }
  
        table += "</table>";
  
        tables += table;
      }
    }
  
    return tables;
  }
  
  
  
  
  
  


  document
    .getElementById("preference-input")
    .addEventListener("input", addPreference);
}
