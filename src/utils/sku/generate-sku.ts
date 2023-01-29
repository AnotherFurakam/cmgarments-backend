//metodo para autogenerar un sku dependiendo de las propiedades
export function generateSKU(
  brand: string,
  category: string,
  color: string,
  size: string,
  name: string,
  gender: string,
): string {
  const result =
    'CMG' +
    '-' +
    brand.substring(0, 3) +
    '-' +
    category.substring(0, 3) +
    '-' +
    color.substring(0, 3) +
    '-' +
    size.substring(0, 3) +
    '-' +
    size.substring(size.length - 3) +
    '-' +
    name.substring(0, 3) +
    '-' +
    name.substring(name.length - 3) +
    '-' +
    gender.substring(0, 3);
  return result;
}
