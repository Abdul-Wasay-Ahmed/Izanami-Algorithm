const IzanamiAlgorithm = require('../IzanamiAlgorithm');

/**
 * Simulated API request task.
 * Randomly succeeds or fails with different error types.
 */
const fetchData = async () => {
  const failChance = Math.random();
  if (failChance < 0.3) {
    throw new Error("Network error: Connection timeout");
  } else if (failChance < 0.6) {
    throw new Error("API error: Rate limit exceeded");
  } else if (failChance < 0.9) {
    throw new Error("Parameter error: Invalid query parameter");
  } else {
    console.log("Data fetched successfully!");
    return "API data";
  }
};

// Custom reflection function (optional)
const customReflection = async (errors) => {
  const errorMessages = errors.map(err => err.message);
  const uniqueErrors = [...new Set(errorMessages)];

  console.log("Custom Reflection Phase:");
  uniqueErrors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });

  console.log("Please review your API configuration and try again.");
  // Here you could add logic to adjust parameters, notify developers, etc.
};

// Instantiate the IzanamiAlgorithm with the task and custom reflection
const izanami = new IzanamiAlgorithm({
  task: fetchData,
  maxAttempts: 5,
  errorThreshold: 3,
  backoffFactor: 2,
  initialDelay: 1000, // 1 second
  onReflection: customReflection, // Optional: Remove or replace for default behavior
  logFile: './logs/error.log'
});

// Event Listeners (optional)
izanami.on('beforeAttempt', (attempt) => {
  console.log(`--- Before Attempt ${attempt} ---`);
});

izanami.on('success', (attempt) => {
  console.log(`Task succeeded on attempt ${attempt}.`);
});

izanami.on('error', ({ attempt, error }) => {
  console.log(`Handled error on attempt ${attempt}: ${error.message}`);
});

izanami.on('reflection', (errors) => {
  console.log("Reflection phase completed.");
});

izanami.on('failure', (errors) => {
  console.log("Task failed after maximum attempts.");
  console.log("Logged Errors:", errors.map(err => err.message));
});

izanami.on('reflectionExit', () => {
  console.log("Ready to retry after reflection.");
});

// Run the task
izanami.runTask();
