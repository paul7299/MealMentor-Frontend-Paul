import { API_URL } from "../../settings.js";
import {
  sanitizeStringWithTableRows,
  handleHttpErrors,
  makeOptions,
} from "../../utils.js";

const SERVER_URL = API_URL + "/userSettings";

export async function initUserSettings(){
    const submitButton = document.getElementById("submit-button");

    submitButton.addEventListener("click", async function (event) {
        const age = document.getElementById("age").value;
        const weight = document.getElementById("weight").value;
        const sex = document.getElementById("sex").value;
        const activityLevel = document.getElementById("activity-level").value;

        const updatedUser = {
            age: parseInt(age),
            weight: parseInt(weight),
            sex: sex,
            activityLevel: activityLevel
        };

        const options = makeOptions("PUT", updatedUser);

        const response = await fetch(SERVER_URL, options);

        if (response.status === 200) {
            alert("User updated successfully");
        } else {
            handleHttpErrors(response);
        }
    });
}