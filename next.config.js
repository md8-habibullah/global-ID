module.exports = {
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/your-username',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/in/your-profile',
        permanent: true,
      },
      {
        source: '/whatsapp',
        destination: 'https://wa.me/your-number',
        permanent: true,
      },
      {
        source: '/facebook',
        destination: 'https://facebook.com/your-profile',
        permanent: true,
      },
    ]
  },
}