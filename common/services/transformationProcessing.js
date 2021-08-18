import axios from 'axios'
import * as env from '../../environment/index.js'


const BASE_URI = `${env.CDM_TRANSFORMATION_PROCESSING_SERVICE_URI}/api/Transformation`
const PLAYGROUND_URI = `${BASE_URI}/Playground`

export const doPlaygroundProcess = (tradeItemId, actionSet) => axios.put(`${PLAYGROUND_URI}`, actionSet, {
    params: { tradeItemId },
})