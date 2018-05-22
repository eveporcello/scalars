var Color = require('color')
var isColor = require('is-color')

var hexColor = Color("#6542f4")
var rgbColor = Color("rgb(153, 153, 255)")
var hslColor = Color("hsl(100, 100%, 70%)")
var colorName = Color("red")


// HEX ===> RGB
console.log("HEX to RGB", hexColor.rgb().string())

// HEX ===> HSL
var hexToHSL = hex => {
    var hslObj = hex.hsl()
    var hslArray = hslObj.color.map((val, i) => 
        i==0 ? Math.round(val) : `${Math.round(val)}%`
    )
    return `hsl(${hslArray[0]}, ${hslArray[1]}, ${hslArray[2]})`
}

console.log("HEX to HSL", hexToHSL(hexColor))

// RGB ===> HEX
console.log("RGB to HEX", rgbColor.hex())

// HSL ===> HEX
console.log("HSL to HEX", hslColor.hex())

// Extra Credit: Opposite Color
console.log("Opposite", hexColor.negate().hex())

// ColorName ===> HSL
console.log(colorName.hsl().string())

const isValidHex = color => (isColor(color) && color.startsWith("#")) ? true : false
const isValidRGB = color => (isColor(color) && color.startsWith("rgb")) ? true : false
const isValidHSL = color => (isColor(color) && color.startsWith("hsl")) ? true : false
const isValidColorName = color => 
    (isColor(color) && !color.startsWith("hsl") && !color.startsWith("rgb") && !color.startsWith("#"))
        ? true
        : false
   
console.log("false, bad color:", isValidHex("93290342"))
console.log("true, valid hex:", isValidHex("#F0F0F0"))
console.log("false, hsl value:", isValidHex("hsl(100, 100%, 70%)"))

console.log(isValidRGB("rgb(0, 0, 0, 0, 0)"))
console.log(isValidRGB("rgb(0, 0, 0)"))
console.log(isValidRGB("#F0F0F0"))

console.log(isValidHSL("not-a-color"))
console.log(isValidHSL("hsl(100, 100%, 70%)"))
console.log(isValidHSL("rgb(0, 0, 0)"))

console.log(isValidColorName("not-a-color"))
console.log(isValidColorName("salmon"))
console.log(isValidColorName("#F0F0F0"))

