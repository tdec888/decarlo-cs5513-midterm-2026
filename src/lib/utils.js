export function randomNumberBetween(min = 0, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomDateBefore(startingDate = new Date()) {
  const randomNumberOfDays = randomNumberBetween(20, 80);
  const randomDate = new Date(
    startingDate - randomNumberOfDays * 24 * 60 * 60 * 1000
  );
  return randomDate;
}

export function getRandomDateAfter(startingDate = new Date()) {
  const randomNumberOfDays = randomNumberBetween(1, 19);
  const randomDate = new Date(
    startingDate.getTime() + randomNumberOfDays * 24 * 60 * 60 * 1000
  );
  return randomDate;
}

export const DIFFICULTY_LABELS = ["Easy", "Moderate", "Hard", "Expert"];

export function difficultyLabel(level) {
  return DIFFICULTY_LABELS[level - 1] || "";
}

export function difficultyValue(label) {
  const index = DIFFICULTY_LABELS.indexOf(label);
  return index === -1 ? null : index + 1;
}

export function formatCoordinates(latitude, longitude) {
  const numericLatitude = Number(latitude);
  const numericLongitude = Number(longitude);

  if (
    latitude === undefined ||
    latitude === null ||
    (typeof latitude === "string" && latitude.trim() === "") ||
    longitude === undefined ||
    longitude === null ||
    (typeof longitude === "string" && longitude.trim() === "") ||
    !Number.isFinite(numericLatitude) ||
    !Number.isFinite(numericLongitude) ||
    numericLatitude < -90 ||
    numericLatitude > 90 ||
    numericLongitude < -180 ||
    numericLongitude > 180
  ) {
    return null;
  }

  return `${numericLatitude.toFixed(5)}, ${numericLongitude.toFixed(5)}`;
}
