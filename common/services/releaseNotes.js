import axios from "axios"
import * as env from '../../environment/index.js'

export const getReleaseNotes = () => axios.get(`${env.CDM_RELEASE_NOTES_URL}`, {
  headers: { sendToken: false }
})
