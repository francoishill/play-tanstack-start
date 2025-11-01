const name = "Play Tanstack Start";
const backgroundColour = "#012730ff";

const localStorageIsDefined = typeof localStorage !== "undefined"; // cater for SSR
const isTraceModeEnabled =
  !localStorageIsDefined ||
  localStorage.getItem("trace") === "1" ||
  localStorage.getItem("trace") === "true";

const logTrace = isTraceModeEnabled
  ? console.trace.bind(
      console,
      `%c ${name} `,
      `background: ${backgroundColour}; color: #fff; border-radius: 15px; padding: 2px;`
    )
  : (): void => {};

export default logTrace;
