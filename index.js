document.addEventListener("DOMContentLoaded", function () {
  const habitDateInput = document.getElementById("habitDate");
  const submitButton = document.getElementById("smbtn");
  const message = document.getElementById("message");
  const listsContainer = document.getElementById("lists");
  const clearBtn = document.getElementById("clear");
  const habitHeader = document.querySelector(".habitHeader");
  const input = document.getElementById("habit");
  let positiveCount = localStorage.getItem("positiveCount") || 0;
  let firstPositveCount = localStorage.getItem("firstPositveCount") || false;
  let thirdPositveCount = localStorage.getItem("thirdPositveCount") || false;

  function clearCongratsMessages() {
    localStorage.removeItem("firstPositveCount");
    localStorage.removeItem("thirdPositveCount");
    localStorage.removeItem("positiveCount");
  }

  // clearCongratsMessages()

  input.focus();
  submitButton.addEventListener("click", addHabit);
  document.getElementById("habit").addEventListener("keypress", function (e) {
    if (e.key === "Enter") addHabit();
  });

  // Load habits from localStorage on page load
  loadHabitsFromLocalStorage();

  function addHabit() {
    const habitDate = habitDateInput.value;
    if (input.value.length === 0 || habitDate === "") {
      alert("Please enter a habit");
      input.focus();
      return;
    }
    // Parse the selected date and the current date
    const selectedDate = new Date(habitDate);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0); // Set time part to midnight
    currentDate.setHours(0, 0, 0, 0);

    // Compare the selected date with the current date
    if (selectedDate < currentDate && selectedDate !== currentDate) {
      alert(
        "Oops! It seems like you've discovered the secret to time travel, but our services are strictly for the present and future. Best of luck with your journey to the past! 🕰️🚀😍"
      );
      return;
    }

    clearBtn.style.display = "block";
    habitHeader.textContent = "Your Behavior Scorecard";
    const habitText = input.value.trim();
    const habitState = document.getElementById("state");

    if (returnState(habitState.value) === "+") {
      const congratulations = document.getElementById("congratulations");
      if (!firstPositveCount) {
        firstPositveCount = true;
        localStorage.setItem("firstPositveCount", firstPositveCount);
        congratulations.textContent = "You earned your first positive habit. Congrats!";
        renderCelebrate();
      } else if (positiveCount === 3) {
        if (!thirdPositveCount) {
          congratulations.textContent =
            "You earned your third positive habit. You're on fire🔥";
        } else {
          congratulations.textContent =
            "Somebody call the fire department🔥🔥🔥😲. That's another hattrick of positive habits.";
        }
        renderCelebrate();
        positiveCount = 0;
        thirdPositveCount = true;
        localStorage.setItem("positiveCount", positiveCount);
        localStorage.setItem("thirdPositveCount", thirdPositveCount);
      }

      function renderCelebrate() {
        const celebrate = document.getElementById("celebration");
        celebrate.style.display = "block";
        congratulations.classList.add("show");
        setTimeout(() => {
          celebrate.style.display = "none";
          congratulations.classList.remove("show");
        }, 5000);
      }

      positiveCount++;
      localStorage.setItem("positiveCount", positiveCount);
    }

    function returnState(state) {
      if (state === "Positive") {
        return "+";
      } else if (state === "Negative") {
        return "-";
      } else {
        return "=";
      }
    }

    const listItem = createHabitListItem(
      habitText,
      returnState(habitState.value)
    );
    const habitList = getOrCreatehabitList(habitDate); // Get or create the habit list
    habitList.appendChild(listItem);

    input.value = "";
    habitDateInput.value = "";
    message.textContent = "Added!";
    setTimeout(() => {
      message.textContent = "";
    }, 1000);

    // Save habits to localStorage
    saveHabitsToLocalStorage();
    renderDate();
    input.focus();
  }

  function clearList() {
    listsContainer.innerHTML = ""; // Clear all lists
    habitHeader.textContent = "Add to your habit list";
    clearBtn.style.display = "none";

    // Clear habits from localStorage
    clearHabitsFromLocalStorage();
  }

  clearBtn.addEventListener("click", clearList);

  function renderDate() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    habitDateInput.value = formattedDate;
  }

  // Call renderDate to set the initial date when the page loads
  renderDate();

  // Get or create a habit list based on the date
  function getOrCreatehabitList(dateString) {
    const formattedDate = formatDate(dateString);
    const listId = `list-${formattedDate}`;

    // Check if a list with this date already exists
    let habitList = document.getElementById(listId);

    if (!habitList) {
      // Create a new list if it doesn't exist
      habitList = document.createElement("ul");
      habitList.id = listId;
      habitList.className = "habitList";

      // Create a heading for the list with the selected date
      const listHeading = document.createElement("h2");
      listHeading.textContent = formattedDate;
      habitList.appendChild(listHeading);

      // Append the list to the lists container
      listsContainer.appendChild(habitList);
    }

    return habitList;
  }

  // Function to format the date
  function formatDate(dateString) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  function createHabitListItem(habitText, stateValue) {
    // Create a new habit list item
    const listItem = document.createElement("li");
    const stateValueElement = document.createElement("span");
    stateValueElement.textContent = stateValue;
    stateValueElement.className = "habitStateValue";

    listItem.innerHTML = `
      <span class="habitText">${habitText}</span>
      <button class="edithabit"><i class="fas fa-pen-square"></i> Edit</button>
      <button class="deletehabit"><i class="fas fa-trash-alt"></i> Delete</button>
    `;

    listItem.insertBefore(stateValueElement, listItem.firstChild);

    listItem.querySelector(".deletehabit").addEventListener("click", () => {
      listItem.remove();
      // Save habits to localStorage after deleting a habit
      saveHabitsToLocalStorage();
    });

    listItem.querySelector(".edithabit").addEventListener("click", () => {
      const habitSpan = listItem.querySelector(".habitText");
      const editedText = prompt("Edit the habit:", habitSpan.textContent);
      if (editedText !== null) {
        habitSpan.textContent = editedText;
        // Save habits to localStorage after editing a habit
        saveHabitsToLocalStorage();
      }
    });

    return listItem;
  }

  function loadHabitsFromLocalStorage() {
    const habits = JSON.parse(localStorage.getItem("habits")) || {};
    if (Object.keys(habits).length === 0) {
      return;
    }

    clearBtn.style.display = "block";
    habitHeader.textContent = "Your Behavior Scorecard";

    for (const dateString in habits) {
      const habitList = getOrCreatehabitList(dateString);
      const habitsForDate = habits[dateString];

      for (const habit of habitsForDate) {
        const formattedDate = new Date(dateString);
        const listItem = createHabitListItem(habit.text, habit.state);
        habitList.appendChild(listItem);
      }
    }
  }

  function saveHabitsToLocalStorage() {
    const habits = {};
    const habitLists = listsContainer.querySelectorAll(".habitList");

    for (const habitList of habitLists) {
      const formattedDate = habitList.querySelector("h2").textContent;
      const dateString = formatDateForLocalStorage(new Date(formattedDate));

      const habitsForDate = [];
      const listItems = habitList.querySelectorAll("li");

      for (const listItem of listItems) {
        const habitText = listItem.querySelector(".habitText").textContent;
        const habitState =
          listItem.querySelector(".habitStateValue").textContent;

        habitsForDate.push({ text: habitText, state: habitState });
      }

      habits[dateString] = habitsForDate;
    }

    localStorage.setItem("habits", JSON.stringify(habits));
  }

  function formatDateForLocalStorage(dateString) {
    const date = new Date(dateString);
    return date.toISOString(); // Use ISO format
  }

  function clearHabitsFromLocalStorage() {
    localStorage.removeItem("habits");
  }
});
