module.exports = {
  apps : [{
    name   : "trailsexplorer-api",
    script : "./server.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}