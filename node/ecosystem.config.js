module.exports = {
  apps : [{
    name: 'CS261_Ass6',
    script: 'assignment6.js',
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    env: {
      PORT: 3100,
      CONNECTIONSTRING: "mongodb://cs261-junki-kim:sgzx5mqACtXgYnqm@54.151.57.127/cs261-junki-kim",
      DBNAME: "cs261-junki-kim",
      COLNAME: "users",
      RDADDRESS: "127.0.0.1",
      RDPORT: 6379,
      RDEXPIRE: 10,
      GAMEPORT: 4200,
      SECRET: "CS261S21"
    }
  }],
};

