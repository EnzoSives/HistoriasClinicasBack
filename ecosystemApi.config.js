module.exports = {
  apps: [
    {
      name: 'Api',
      script: 'npm',
      args: 'run start:prod',
      watch: true, // reiniciar automáticamente la aplicación al cambiar los archivos
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
