const { GraphQLServer } = require('graphql-yoga')
const { GraphQLScalarType } = require('graphql')
const Color = require('color')
const isColor = require('is-color')

const typeDefs = `
    scalar HEX
    scalar RGB
    scalar HSL

    type ColorValue {
        hex: HEX!
        rgb: RGB!
        hsl: HSL!
    }

    type Query {
        allColors: [ColorValue!]!
    }

    union Color = HEX | RGB | HSL 

    type Mutation {
        addColor(color: HEX!): ColorValue
    }
`

const colors = ["#4286f4", "#00bfff", "#c2f437"]

// Validation Checks
const isValidHex = color => (isColor(color) && color.startsWith("#")) ? true : false
const isValidRGB = color => (isColor(color) && color.startsWith("rgb")) ? true : false
const isValidHSL = color => (isColor(color) && color.startsWith("hsl")) ? true : false

// Color Conversions
const hexToRGB = color => Color(color).rgb().string()

var hexToHSL = hex => {
    var hslObj = Color(hex).hsl()
    var hslArray = hslObj.color.map((val, i) => 
        i==0 ? Math.round(val) : `${Math.round(val)}%`
    )
    return `hsl(${hslArray[0]}, ${hslArray[1]}, ${hslArray[2]})`
}

const resolvers = {
    Query: {
        allColors: () => colors
    },
    Mutation: {
      addColor(root, { color }) {
        colors.push(color)
        return color
      }
    },
    ColorValue: {
        hex: _ => _,
        rgb: _ => _,
        hsl: _ => _
    },
    Color: {
        __resolveType: value => value.startsWith("#") ? 
            'HEX' : 
            value.startsWith("rgb") ?
                'RGB' : 'HSL'

    },
    HEX: new GraphQLScalarType({
      name: 'HEX',
      description: 'A color in hexadecimal format.',
      parseValue: value => isValidHex(value) ?
        value :
        new Error(`invalid hex color value when parsing value: ${value}`),
      serialize: value => value,
      parseLiteral: ast => {
          if (!isValidHex(ast.value)) {
            throw new Error(`invalid hex color value when parsing literal: ${ast.value}`)
          }
          return ast.value
      }
    }),
    RGB: new GraphQLScalarType({
        name: 'RGB',
        description: 'A color in rgb format.',
        parseValue: value => isValidRGB(value) ?
          value :
          new Error(`invalid rgb color value when parsing value: ${value}`),
        serialize: value => hexToRGB(value),
        parseLiteral: ast => {
            if (!isValidRGB(ast.value)) {
              throw new Error(`invalid rgb color value when parsing literal: ${ast.value}`)
            }
            return ast.value
        }
      }),
      HSL: new GraphQLScalarType({
        name: 'HSL',
        description: 'A color in hsl format.',
        parseValue: value => isValidHSL(value) ?
          value :
          new Error(`invalid hsl color value when parsing value: ${value}`),
        serialize: value => hexToHSL(value),
        parseLiteral: ast => {
            if (!isValidHSL(ast.value)) {
              throw new Error(`invalid hsl color value when parsing literal: ${ast.value}`)
            }
            return ast.value
        }
      }),
    //   ColorName: new GraphQLScalarType({
    //     name: 'ColorName',
    //     description: 'A valid HTML color name.',
    //     parseValue: value => isValidColorName(value) ?
    //       value :
    //       new Error(`invalid html color: ${value}`),
    //     serialize: value => value,
    //     parseLiteral: ast => {
    //         if (!isValidColorName(ast.value)) {
    //           throw new Error(`invalid html color: ${ast.value}`)
    //         }
    //         return ast.value
    //     }
    //   })
}

const server = new GraphQLServer({ typeDefs, resolvers })
const options = {
    port: 4000,
    endpoint: '/graphql',
    playground: '/playground'
}
const ready = ({ port }) => console.log(`graph service running - http://localhost:${port}`)
server.start(options, ready)