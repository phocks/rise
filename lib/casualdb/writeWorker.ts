import { writeJson, writeJsonSync } from 'https://deno.land/x/jsonfile/mod.ts';

self.onmessage = async (e) => {
  const { file, data, taskId } = e.data;
  console.debug(`[casualdb:worker:debug] write task: ${taskId}`);

  try {
    await writeJson(file, data);
    self.postMessage({ taskId, error: false });
  } catch (error) {
    self.postMessage({ taskId, error: error.valueOf() });
  } finally {
    self.close();
  }
};
