import { API_URL } from "../../settings.js";
import {
  sanitizeStringWithTableRows,
  handleHttpErrors,
  makeOptions,
} from "../../utils.js";

const SERVER_URL = API_URL + "/user";

export async function initUserSettings(){
    const submitButton = document.getElementById("submit-button");

    submitButton.addEventListener("click", async function (event) {
        let allergies = [];
        
        const age = document.getElementById("age").value;
        const weight = document.getElementById("weight").value;
        const height = document.getElementById("height").value;
        const activityLevel = document.getElementById("activity-level").value;

        const allergyContainer = document.getElementById("allergy-container");
        const allergyInputs =
          allergyContainer.querySelectorAll('input[type="text"]');
        allergyInputs.forEach((a) => {
          if (a.value.trim().length > 0) {
            allergies.push(a.value);
          }
        });
        
        const updatedUser = {
            age: parseInt(age),
            weight: parseInt(weight),
            height: parseInt(height),
            allergies: allergies,
            activityLevel: activityLevel
        };
        
        const token = localStorage.getItem("token");
        const options = makeOptions("PUT", updatedUser, token);
        const username = localStorage.getItem("user");
        const response = await fetch(SERVER_URL + "/" + username, options);
        
        if (response.status === 200) {
            alert("User updated successfully");
        } else {
            handleHttpErrors(response);
        }
    });

    function addAllergy(event) {
        if (event.target.value.length === 1) {
          const inputContainer = document.getElementById("allergy-container");
          const newInput = document.createElement("input");
          newInput.type = "text";
          newInput.placeholder = "Enter a preference/allergy";
          inputContainer.appendChild(newInput);
          newInput.addEventListener("input", addAllergy);
        }
      }
    document
    .getElementById("allergy-input")
    .addEventListener("input", addAllergy);
}