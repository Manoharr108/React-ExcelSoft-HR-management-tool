
const progressMap = new Map();

const setProgress = (key, percent) => {
  progressMap.set(key, percent);
};

const getProgress = (key) => {
  return progressMap.get(key) || 0;
};

const clearProgress = (key) => {
  progressMap.delete(key);
};

module.exports = { setProgress, getProgress, clearProgress };