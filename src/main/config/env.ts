export default {
  mongoURl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/comporapp',
  port: process.env.PORT ?? 5050
}
