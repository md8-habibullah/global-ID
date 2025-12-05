module.exports = {
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/md8-habibullah',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/in/md8-habibullahs',
        permanent: true,
      },
      {
        source: '/whatsapp',
        destination: 'https://wa.me/8801329876070',
        permanent: true,
      },
      {
        source: '/facebook',
        destination: 'https://facebook.com/md8.habibullah',
        permanent: true,
      },
    ]
  },
}