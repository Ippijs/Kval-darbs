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

export const translateProductDescription = (description) => {
  if (!description) return ''

  return convertImperialUnitsToMetric(description)
}
