//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import { setActiveLink, loadHtml, renderHtml } from "./utils.js";

import { initMealPlanGenerator } from "./pages/mealPlanGenerator/mealPlanGenerator.js";
import { initUserSettings } from "./pages/userSettings/userSettings.js";

import { initLogin } from "./pages/login/login.js";
import { toggleUiBasedOnRoles } from "./pages/login/login.js";

window.addEventListener("load", async () => {
  const templateMealPlanGenerator = await loadHtml(
    "./pages/mealPlanGenerator/mealPlanGenerator.html"
  );

  const templateUserSettings = await loadHtml(
    "./pages/userSettings/userSettings.html"
  );

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
        done();
        isLoggedIn();
      },
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () =>
        (document.getElementById("content").innerHTML = `
        <div class="container" style="width: 80%">
        <h1>Meal Plan Generator</h1>
        <br>
        <p>Velkommen til applikationen, der bruger AI til at generere opskrifter ud fra dine behov. 
        Du kan indtaste din vægt, højde, køn, allergier og fortælle hvis du har et mål som f.eks. at tabe dig. 
        Derefter kan AI'en tilpasse opskrifterne ud fra dette, hvor du derefter kan gemme opskrifterne på din bruger.</p>
        </div>
     `),
      "/mealPlanGenerator": () => {
        renderHtml(templateMealPlanGenerator, "content");
        initMealPlanGenerator();
      },
      "/userSettings": () => {
        renderHtml(templateUserSettings, "content");
        initUserSettings();
      },

      "/login": () => {
        renderHtml(templateLogin, "content");
        initLogin();
      },
      "/logout": () => {
        logout();
        alert("You are now logged out");
      },
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content");
    })
    .resolve();
});

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

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("roles");
  toggleUiBasedOnRoles(false);
}

function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (token == null) {
    toggleUiBasedOnRoles(false);
  } else {
    toggleUiBasedOnRoles(true);
  }
}
