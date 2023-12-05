//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import { setActiveLink, loadHtml, renderHtml, } from "./utils.js";

import { initMealPlanGenerator } from "./pages/mealPlanGenerator/mealPlanGenerator.js";
import { initUserSettings } from "./pages/userSettings/userSettings.js";

import { initLogin } from "./pages/login/login.js";
import { toggleUiBasedOnRoles, isUserLoggedIn, logout } from "./pages/login/login.js";



window.addEventListener("load", async () => {

  const templateMealPlanGenerator = await loadHtml("./pages/mealPlanGenerator/mealPlanGenerator.html");

  const templateUserSettings = await loadHtml("./pages/userSettings/userSettings.html");

  const templateLogin = await loadHtml("./pages/login/login.html");  
  
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");


  //If token existed, for example after a refresh, set UI accordingly
  const token = localStorage.getItem("token");

  //toggleLoginStatus(token);

  // @ts-ignore
  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  // @ts-ignore

  
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        isLoggedIn();
        done();
        
      },
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () =>
        (document.getElementById("content").innerHTML = `
        <div class="container" style="width: 80%">
        <h1>Meal Plan Generator</h1>
        <p>About:</p>


        <img style="width: 50%;" src="images/MealMentorLogoV2 (1).png" />
      </div>

     `),
      "/mealPlanGenerator": () => {
        handleProtectedRoute(templateMealPlanGenerator);
        initMealPlanGenerator();
      },
      "/userSettings": () => {
        handleProtectedRoute(templateUserSettings);
        initUserSettings();
      },

      "/login": () => {
        renderHtml(templateLogin, "content");
        initLogin();
      },
      "/logout": () => {
        logout();
        alert("You are now logged out")
      },
  
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content");
    })
    .resolve();
});
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const themeToggleCheckbox = document.getElementById('themeToggleCheckbox'); // Corrected ID
  if (themeToggleCheckbox instanceof HTMLInputElement) {
    themeToggleCheckbox.checked = savedTheme === 'dark'; // Checkbox checked if theme is dark
  }
  setTheme(savedTheme);
});

document.getElementById('themeToggleCheckbox').addEventListener('change', function() {
  const newTheme = this.checked ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  const navbar = document.querySelector('.navbar');
}



window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert(
    "Error: " +
      errorMsg +
      " Script: " +
      url +
      " Line: " +
      lineNumber +
      " Column: " +
      column +
      " StackTrace: " +
      errorObj
  );
};



function isLoggedIn() {
  if (isUserLoggedIn()) {  
    toggleUiBasedOnRoles(true);
  } else {
    toggleUiBasedOnRoles(false);
  }
}


       function handleProtectedRoute(template) {
        if (!isUserLoggedIn()) {
          // If not logged in, display an alert and redirect to the index page
          alert("You should be logged in to access this page.");
          window.location.href = "/";
        } else {
          // If logged in, render the protected page
          renderHtml(template, "content");
        }
      }
