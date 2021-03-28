import { MongoHelper } from '../infra/data/helpers/mongoHelper'
import env from './config/env'

MongoHelper.connect(env.mongoURl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log('serer running'))
  })
  .catch(console.error)
