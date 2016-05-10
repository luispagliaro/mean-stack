module.exports = {
  'port': process.env.PORT || 8080,
  'env': process.env.NODE_ENV || 'development',
  'database': 'mongodb://127.0.0.1:27017/database',
  'secret': 'meanstackapp'
}