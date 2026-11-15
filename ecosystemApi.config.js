module.exports = {
  apps: [
    {
      name: 'Api',
      script: 'npm',
      args: 'run start:prod',
      // Sin watch: los archivos subidos caen en ./uploads y reiniciarían la API.
      // Reiniciar a mano tras cada deploy: pm2 restart Api --update-env
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
