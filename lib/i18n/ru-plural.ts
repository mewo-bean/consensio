export function ruPlural(
  count: number,
  one: string,
  few: string,
  many: string,
) {
  const abs = Math.abs(count);
  const mod100 = abs % 100;
  const mod10 = abs % 10;

  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export function formatCountRu(
  count: number,
  one: string,
  few: string,
  many: string,
) {
  return `${count} ${ruPlural(count, one, few, many)}`;
}

