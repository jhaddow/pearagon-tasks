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
  const incrementCount = async (increment: number) => {
    try {
      const response = await fetch("/increment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ increment }),
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

  const getCount = async (): Promise<number> => {
    try {
      const response = await fetch("/count");
      if (response.ok) {
        const data = await response.json();
        return data.count;
      } else {
        throw new Error("Failed to get count");
      }
    } catch (error) {
      throw error;
    }
  };

  const incrementClickHandler = async () => {
    await incrementCount(1);
  };

  // Function to send a POST request to multiply the count
  const multiplyClickHandler = async () => {
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
      const currentCount = await getCount();

      const increment = multiplier * currentCount - currentCount;

      await incrementCount(increment);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to send a POST request to reset the count
  const resetClickHandler = async () => {
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
  incrementButton.addEventListener("click", incrementClickHandler);

  // Event listener for the multiply button
  multiplyButton.addEventListener("click", multiplyClickHandler);

  // Event listener for the reset button
  resetButton.addEventListener("click", resetClickHandler);
});
