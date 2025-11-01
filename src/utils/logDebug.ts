const name = "Play Tanstack Start";
const backgroundColour = "#004656";

const localStorageIsDefined = typeof localStorage !== "undefined"; // cater for SSR
const isDebugModeEnabled =
  !localStorageIsDefined ||
  localStorage.getItem("debug") === "1" ||
  localStorage.getItem("debug") === "true";

const logDebug = isDebugModeEnabled
  ? console.debug.bind(
      console,
      `%c ${name} `,
      `background: ${backgroundColour}; color: #fff; border-radius: 15px; padding: 2px;`
    )
  : (): void => {};

export default logDebug;
