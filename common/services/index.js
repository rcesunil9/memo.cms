import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use(function(config){
   const token = localStorage.getItem('token')
   if (token) {
    if(config.headers.sendToken !== false) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    config.headers.common['Content-Type'] = 'application/json'
    // dotnet way of handling arrays
    config.paramsSerializer = params => qs.stringify(params, {arrayFormat: 'indices'})
   }
  return config
})

const exit = () => {
  localStorage.setItem('token', null);
  localStorage.setItem('user', null);
  window.location.href = `/`
}

// Every 401 must empty token
axios.interceptors.response.use(
  (response => {
    return response
  }),
  (error => {
    if(error && error.response && error.response.status === 401) exit(error)
    return Promise.reject(error)
  })
);