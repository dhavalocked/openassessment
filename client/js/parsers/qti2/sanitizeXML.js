const regex = /<!\[CDATA\[(.*?)\]\]>/g;

export function sanitize(xmlString) {
  return xmlString.replace(regex, '$1');
}
