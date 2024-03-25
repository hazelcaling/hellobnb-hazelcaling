export function arrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].url !== arr2[i].url) return false
  }
  return true
}
