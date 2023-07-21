export const convertStringToFile = (str?: string) => {
  if (!str) {
    return null
  }
  const blob = new Blob([str], { type: 'text/plain' });
  const file = new File([blob], "code.js", {type: "text/plain"});
  return file
}
