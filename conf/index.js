'use strict';

module.exports = {
  
  server: {
    port: 3010,
    title: 'Arroyo',
    keywords: '',
    description: '',
    author: 'alvansea#gmail.com',

    sessionSecret: 'arroyo#session2014',
    userSalt: 'arroyo#user2014'
  },

  db: {
    'mysql': {
      host:           'localhost',
      port:           '3306',
      username:       'arroyo_admin',
      password:       'admin',
      database:       'arroyo_dev',
      charset:        'utf8',
      collation:      'utf8_general_ci'
    },
    'redis': {
      host:           'localhost',
      port:           6379,
      prefix:         'arroyo',
      ttl:            1000,
      disableTTL:     true,
      db:             1,
      unref:          true,
      pass:           'RequireClientsToIssueAuthAt2015'
    },
    mongodb: 'mongodb://arroyo_admin:admin@localhost/arroyo_dev',
  }
}