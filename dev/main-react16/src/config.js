
let config = {
  react16: 'http://localhost:3001/',
  react17: 'http://localhost:3002/',
  vue2: 'http://localhost:4001/',
  vue3: 'http://localhost:4002/',
  vite2: 'http://localhost:7001/',
  vite4: 'http://localhost:7002/',
  angular11: 'http://localhost:6001/',
  angular14: 'http://localhost:6002/',
}
const isEnvPro = process.env.NODE_ENV === 'production'

if (isEnvPro) {
  const locationOrigin = `${location.origin}/`
  config = {
    react16: locationOrigin,
    react17: locationOrigin,
    vue2: locationOrigin,
    vue3: locationOrigin,
    angular11: locationOrigin,
    angular14: locationOrigin,
    vite2: locationOrigin,
    vite4: locationOrigin,
  }
}

export default config
