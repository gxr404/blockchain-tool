export const getEccFormula = (a: number, b: number, p?: number) => {
  let axPart = ''
  let bPart = ''

  if (a !== 0) {
    const aSymbol = a > 0 ? '+' : '-'
    const aAbs = Math.abs(a)
    axPart = `${aSymbol} ${aAbs === 1 ? '' : aAbs}x`
  } else {
    axPart = ''
  }

  if (b !== 0) {
    const bSymbol = b > 0 ? '+' : '-'
    const bAbs = Math.abs(b)
    bPart = `${bSymbol} ${bAbs}`
  } else {
    bPart = ''
  }

  return `y^2 = x^3 ${axPart} ${bPart} ${p ? `\\mod ${p}` : ''}`
}
