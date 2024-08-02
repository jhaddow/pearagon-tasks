document.addEventListener("DOMContentLoaded", () => {
  const countElement = document.getElementById("count");
  const incrementButton = document.getElementById("increment");
  const multiplyButton = document.getElementById("multiply");
  const resetButton = document.getElementById("reset");

  if (!countElement || !incrementButton || !multiplyButton || !resetButton) {
    console.error("Unable to find essential elements");
    return;
  }

  // Function to send a POST request to increment the count
  const incrementCount = async () => {
    try {
      const response = await fetch("/increment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ increment: 1 }),
      });
      if (response.ok) {
        const data = await response.json();
        countElement.textContent = data.count;
      } else {
        console.error("Failed to increment count");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to send a POST request to multiply the count
  const multiplyCount = async () => {
    try {
      // get value from multiplier input
      const multiplierInput = document.getElementById(
        "multiplier"
      ) as HTMLInputElement;
      if (!multiplierInput) {
        console.error("Unable to find multiplier input");
        return;
      }

      const multiplier = parseInt(multiplierInput.value);
      if (isNaN(multiplier)) {
        console.error("Invalid multiplier");
        return;
      }

      const response = await fetch("/multiply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ multiplier: multiplier }),
      });
      if (response.ok) {
        const data = await response.json();
        countElement.textContent = data.count;
      } else {
        console.error("Failed to multiply count");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to send a POST request to reset the count
  const resetCount = async () => {
    try {
      const response = await fetch("/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        countElement.textContent = data.count;
      } else {
        console.error("Failed to reset count");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Event listener for the increment button
  incrementButton.addEventListener("click", incrementCount);

  // Event listener for the multiply button
  multiplyButton.addEventListener("click", multiplyCount);

  // Event listener for the reset button
  resetButton.addEventListener("click", resetCount);
});
