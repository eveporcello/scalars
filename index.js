const { GraphQLServer } = require('graphql-yoga')
const { GraphQLScalarType } = require('graphql')

const typeDefs = `
    scalar HEX

    type ColorValue {
        hex: HEX!
    }

    type Query {
        allColors: [ColorValue!]!
    }

    type Mutation {
        addColor(color: HEX!): ColorValue
    }
`

const colors = [
  { "hex": "#4286f4" },
  { "hex": "#00bfff" },
  { "hex": "#c2f437" }
]

const isValidHex = value => /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(value)
// const isValidHSL = value => /^hsl\((0|360|35\d|3[0-4]\d|[12]\d\d|0?\d?\d),(0|100|\d{1,2})%,(0|100|\d{1,2})%\)$/.test(value)
// const isValidRGB = value => /^rgb\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)\)$/.test(value)


const resolvers = {
    Query: {
        allColors: () => colors
    },
    Mutation: {
      addColor(root, {color}) {
        let newColor = {
            hex: color
            //rgb: funNpm.toRgb(color),
            //hsl: funNpm.toHSL(color)
        }
        colors.push(newColor)
        return newColor
        
      }
    },
    HEX: new GraphQLScalarType({
      name: 'HEX',
      description: 'A color in hexadecimal format.',
      parseValue: value => isValidHex(value) ?
        value :
        new Error(`invalid hex color value: ${value}`),
      serialize: value => value,
      parseLiteral: ast => {
          if (!isValidHex(ast.value)) {
            throw new Error(`invalid hex color value: ${ast.value}`)
          }
          return ast.value
      }
    })
}

const server = new GraphQLServer({ typeDefs, resolvers })
const options = {
    port: 4000,
    endpoint: '/graphql',
    playground: '/playground'
}
const ready = ({ port }) => console.log(`graph service running - http://localhost:${port}`)
server.start(options, ready)