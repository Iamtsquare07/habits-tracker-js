document.addEventListener("DOMContentLoaded", function () {
  const habitDateInput = document.getElementById("habitDate");
  const submitButton = document.getElementById("smbtn");
  const message = document.getElementById("message");
  const listsContainer = document.getElementById("lists");

  const clearBtn = document.getElementById("clear");
  const habitHeader = document.querySelector(".habitHeader");

  submitButton.addEventListener("click", addHabit);
  document.getElementById("habit").addEventListener("keypress", function (e) {
    if (e.key === "Enter") addHabit();
  });

  // Set the value of the date input to the current date (formatted as "YYYY-MM-DD")
  function renderDate() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    habitDateInput.value = formattedDate;
  }

  renderDate();

  function addHabit() {
    const input = document.getElementById("habit");
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
    habitHeader.textContent = "";
    const habitText = input.value.trim();
    const habitState = document.getElementById("state");
    function returnState(state) {
      if (state === "Positive") {
        return "+";
      } else if (state === "Negative") {
        return "-";
      } else {
        return "=";
      }
    }
    const listItem = document.createElement("li");
    const stateValue = document.createElement("span");
    stateValue.textContent = returnState(habitState.value);
    stateValue.className = "habitStateValue";

    listItem.innerHTML = `
              <span class="habitText">${habitText}</span>
              <button class="edithabit"><i class="fas fa-pen-square"></i> Edit</button>
              <button class="deletehabit"><i class="fas fa-trash-alt"></i> Delete</button>
          `;

    listItem.insertBefore(stateValue, listItem.firstChild);

    const habitList = getOrCreatehabitList(habitDate); // Get or create the habit list
    habitList.appendChild(listItem);

    input.value = "";
    habitDateInput.value = "";
    message.textContent = "Added!";
    setTimeout(() => {
      message.textContent = "";
    }, 2000);

    listItem.querySelector(".deletehabit").addEventListener("click", () => {
      listItem.remove();
    });

    listItem.querySelector(".edithabit").addEventListener("click", () => {
      const habitSpan = listItem.querySelector(".habitText");
      const editedText = prompt("Edit the habit:", habitSpan.textContent);
      if (editedText !== null) {
        habitSpan.textContent = editedText;
      }
    });

    renderDate();
  }

  function clearList() {
    listsContainer.innerHTML = ""; // Clear all lists
    habitHeader.textContent = "Add to your habit list";
    clearBtn.style.display = "none";
  }

  clearBtn.addEventListener("click", clearList);

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
});
