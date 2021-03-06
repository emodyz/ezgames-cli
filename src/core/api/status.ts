import axios from 'axios'
import https from 'node:https'
import {getAppEnv} from '../env/env'
import * as rax from 'retry-axios'
import {ApiErrors} from '../errors/api'
import InvalidHealthCheckResponseError = ApiErrors.InvalidHealthCheckResponseError

export async function getAppHealth() {
  const {data: health} = await axios.get(`http://${getAppEnv().EZG_HOST}/health`, {
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
    throw new InvalidHealthCheckResponseError()
  }

  return health
}

export async function waitForHealthyApp() {
  rax.attach(axios)
  const {data: health} = await axios.get(`http://${getAppEnv().EZG_HOST}/health`, {
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

