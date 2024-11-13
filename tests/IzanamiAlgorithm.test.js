const IzanamiAlgorithm = require('../src/IzanamiAlgorithm');

describe('IzanamiAlgorithm', () => {
  test('should execute task successfully without errors', async () => {
    const mockTask = jest.fn().mockResolvedValue("Success");
    const izanami = new IzanamiAlgorithm({
      task: mockTask,
      maxAttempts: 3,
      errorThreshold: 2,
      logFile: './logs/test.log'
    });

    await izanami.runTask();

    expect(mockTask).toHaveBeenCalledTimes(1);
  });

  test('should enter reflection phase after reaching error threshold', async () => {
    const mockTask = jest.fn().mockRejectedValue(new Error("Test Error"));
    const izanami = new IzanamiAlgorithm({
      task: mockTask,
      maxAttempts: 5,
      errorThreshold: 3,
      logFile: './logs/test.log'
    });

    await izanami.runTask();

    expect(mockTask).toHaveBeenCalledTimes(3); // Should stop after 3 errors
    expect(izanami.errorLoop).toBe(true);
  });

  test('should respect maxAttempts', async () => {
    const mockTask = jest.fn().mockRejectedValue(new Error("Test Error"));
    const izanami = new IzanamiAlgorithm({
      task: mockTask,
      maxAttempts: 4,
      errorThreshold: 5, // Higher than maxAttempts
      logFile: './logs/test.log'
    });

    await izanami.runTask();

    expect(mockTask).toHaveBeenCalledTimes(4);
    expect(izanami.errorLoop).toBe(false);
  });
});
