require('dotenv').config(); 

module.exports = {
  googleClientID:
    '70265989829-0t7m7ce5crs6scqd3t0t6g7pv83ncaii.apps.googleusercontent.com',
  googleClientSecret: '8mkniDQOqacXtlRD3gA4n2az',
  // mongoURI:
  //   "mongodb+srv://segundojuanok:yP73XhTh25aWfnZY@cluster-fantast.wuzf804.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-fantast",
  mongoURI: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster-fantast.wuzf804.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-fantast`,

  cookieKey: '123123123',
};
