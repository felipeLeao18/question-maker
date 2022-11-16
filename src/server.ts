/* eslint-disable no-console */
import { app } from '@app'
import { config } from '@config'
import { connect } from '@lib/db'

const initialize = async () => {
  await connect()
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
}

initialize().catch(err => console.error(err))
