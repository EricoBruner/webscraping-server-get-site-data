export function formattedText(text: string) {
  const formattedText = text.replace(/\n/g, "").replace(/\t/g, "")
  return formattedText;
}