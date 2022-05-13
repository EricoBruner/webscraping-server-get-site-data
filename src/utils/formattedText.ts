export function formattedText(text: string) {
  if(!text) {
    return "Falhou!"
  }
  const formattedText = text.replace(/\n/g, "").replace(/\t/g, "")
  return formattedText;
}