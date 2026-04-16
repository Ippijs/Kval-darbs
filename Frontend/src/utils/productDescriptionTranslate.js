const exactLvDescriptions = {
  'Perfect for beginners. Durable spincast fishing rod 5.5ft long': 'Ideali iesacejiem. Izturigs spincast makskerkats, 1.68 m gars.',
  'Professional baitcasting rod for advanced anglers. 6ft length': 'Profesionalais baitcasting makskerkats pieredzejusiem makskerniekiem. 1.83 m garums.',
  'Smooth spinning reel with 5 bearings. Perfect for freshwater': 'Vienmeriga spininga spole ar 5 gultniem. Ideala saldudens makskeresanai.',
  'High-speed baitcasting reel for saltwater fishing': 'Liela atruma baitcasting spole juras makskeresanai.',
  'Braided fishing line 20lb test strength': 'Pita makskeraukla ar 9.1 kg testa izturibu.',
  'Assorted pack of 10 realistic fishing lures': 'Daudzveidigs komplekts ar 10 realistiskam makskeresmasam.',
  'Landing net with rubber mesh. Extends to 6ft': 'Uztveramais tikls ar gumijotu sietu. Izvelkams lidz 1.83 m.',
  'Waterproof tackle box with compartments for organization': 'Udensaizsargata piederumu kaste ar nodalijumiem kartigai glabasanai.',
  'Assorted pack of 50 stainless steel hooks': 'Daudzveidigs komplekts ar 50 nerusejosa terauda akiem.',
  'Mix of sinker weights for different fishing conditions': 'Dazadu svinu komplekts atskirigiem makskeresanas apstakliem.',
  'Warm neoprene gloves for cold water fishing': 'Silti neoprena cimdi makskeresanai auksta udens apstaklos.',
  'Waterproof fishing backpack with multiple compartments': 'Udensaizsargata makskeresanas mugursoma ar vairakiem nodalijumiem.'
}

const toMetricLength = (value) => {
  const meters = value * 0.3048
  if (meters < 1) {
    return `${Math.round(meters * 100)} cm`
  }

  return `${meters.toFixed(2)} m`
}

const toMetricWeight = (value) => {
  const kg = value * 0.45359237
  return `${kg.toFixed(1)} kg`
}

const convertImperialUnitsToMetric = (text) => {
  if (!text) return ''

  let converted = text

  converted = converted.replace(/(\d+(?:\.\d+)?)\s*(ft|feet|foot)\b/gi, (_, num) => {
    return toMetricLength(parseFloat(num))
  })

  converted = converted.replace(/(\d+(?:\.\d+)?)\s*(lb|lbs|pound|pounds)\b/gi, (_, num) => {
    return toMetricWeight(parseFloat(num))
  })

  return converted
}

const lvReplacementRules = [
  [/\bhigh[- ]quality\b/gi, 'augstas kvalitates'],
  [/\bpremium\b/gi, 'premium'],
  [/\blightweight\b/gi, 'viegls'],
  [/\bdurable\b/gi, 'izturigs'],
  [/\bstrong\b/gi, 'stiprs'],
  [/\bpowerful\b/gi, 'jaudigs'],
  [/\bcompact\b/gi, 'kompakts'],
  [/\badjustable\b/gi, 'regulejams'],
  [/\bcomfortable\b/gi, 'erts'],
  [/\bwaterproof\b/gi, 'udensaizsargats'],
  [/\bfor\b/gi, 'prieks'],
  [/\bwith\b/gi, 'ar'],
  [/\band\b/gi, 'un'],
  [/\bideal\b/gi, 'ideals'],
  [/\bperfect\b/gi, 'perfekts'],
  [/\bexcellent\b/gi, 'izcils'],
  [/\bfishing\b/gi, 'makskeresanas'],
  [/\bfishermen\b/gi, 'makskerniekiem'],
  [/\brod\b/gi, 'makskerkats'],
  [/\breel\b/gi, 'spole'],
  [/\bline\b/gi, 'aukla'],
  [/\blure\b/gi, 'esma'],
  [/\bhook\b/gi, 'akis'],
  [/\bnet\b/gi, 'tikls'],
  [/\bbackpack\b/gi, 'mugursoma'],
  [/\bbox\b/gi, 'kaste'],
  [/\bstorage\b/gi, 'somas/kastes'],
  [/\bquick\b/gi, 'atrs'],
  [/\bsmooth\b/gi, 'vienmerigs'],
  [/\bcasting\b/gi, 'mesanai'],
  [/\bspinning\b/gi, 'spininga'],
  [/\bbraided\b/gi, 'pita'],
  [/\bmonofilament\b/gi, 'monofila'],
  [/\bfluorocarbon\b/gi, 'fluorkarbona'],
  [/\bweight\b/gi, 'svars'],
  [/\bset\b/gi, 'komplekts']
]

export const translateProductDescription = (description, language) => {
  if (!description) return ''
  if (language !== 'lv') return convertImperialUnitsToMetric(description)

  const exact = exactLvDescriptions[description]
  if (exact) return exact

  let translated = description
  lvReplacementRules.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement)
  })

  return convertImperialUnitsToMetric(translated)
}
