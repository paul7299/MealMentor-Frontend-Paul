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

      // user info
      const sex = document.getElementById("sex").value;
      const age = document.getElementById("age").value;
      const weight = document.getElementById("weight").value;
      const activityLevel = document.getElementById("activity-level").value;

      // Goals
      const goals = document.getElementById("goalsText").value;

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

      //Amount of days
      const amountOfDays = document.getElementById("select-days").value;

      const username = localStorage.getItem("user")
      console.log(username)

      // Combining all values to create JSON
      const fullUserInput = {
        username,
        age,
        sex,
        weight,
        activityLevel,
        mealChecklist,
        preferences,
        goals,
        amountOfDays,
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

        //alert("Answer from OpenAI received");

        document.getElementById("wait-button").style.display = "none";
        document.getElementById("submit-button").style.display = "block";
        return responseData;
      } else {
        document.getElementById("wait-button").style.display = "none";
        document.getElementById("submit-button").style.display = "block";
        const errorData = await response.json();
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
  function createTable(jsonObject) {
    var table = "<table border='1'>";

    for (var key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        var value = jsonObject[key];
        table += "<tr><td><b>" + key + "</b></td>";

        if (Array.isArray(value)) {
          // If the value is an array, iterate through its elements
          table += "<td>";
          value.forEach(function (item) {
            // If the item is an object, create a nested table
            if (typeof item === "object" && item !== null) {
              table += createNestedTable(item);
            } else {
              // For simple array elements
              table += item + "<br>";
            }
          });
          table += "</td>";
        } else if (typeof value === "object") {
          // If the value is an object, create a nested table
          table += "<td>" + createNestedTable(value) + "</td>";
        } else {
          // For simple key-value pairs
          table += "<td>" + value + "</td>";
        }
        table += "</tr>";
      }
    }

    table += "</table>";
    return table;
  }

  function createNestedTable(nestedObject) {
    var nestedTable = "<table border='1'>";

    for (var key in nestedObject) {
      if (nestedObject.hasOwnProperty(key)) {
        var value = nestedObject[key];
        nestedTable += "<tr><td><b>" + key + "</b></td>";

        if (Array.isArray(value)) {
          // Handle array elements
          nestedTable += "<td>" + value.join(", ") + "</td>";
        } else {
          // Handle normal elements
          nestedTable += "<td>" + value + "</td>";
        }

        nestedTable += "</tr>";
      }
    }

    nestedTable += "</table>";
    return nestedTable;
  }

  document
    .getElementById("preference-input")
    .addEventListener("input", addPreference);
}
