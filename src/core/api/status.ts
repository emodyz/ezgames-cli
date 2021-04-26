import axios from 'axios'
import https from 'https'
import {getAppEnv} from '../env'
import * as rax from 'retry-axios'

export async function getAppHealth() {
  const {data: health} = await axios.get(`${getAppEnv().APP_URL}/health`, {
  // const {data: health} = await axios.get('http://localhost/health', {
    httpsAgent: new https.Agent(
      {
        rejectUnauthorized: false,
      },
    ),
    // MAKES AXIOS IGNORE 5XX STATUS CODES
    validateStatus: () => true,
  })

  if (typeof health !== 'object' || health === null) {
    throw new Error('Invalid HealthCheck response')
  }

  return health
}

export async function waitForHealthyApp() {
  rax.attach(axios)
  const {data: health} = await axios.get(`${getAppEnv().APP_URL}/health`, {
  // const {data: health} = await axios.get('http://localhost/health', {
    raxConfig: {
      retry: 256,
      noResponseRetries: 256,
      retryDelay: 5000,
      backoffType: 'static',
    },
  })
  return health
}

