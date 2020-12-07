const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongo = require('./mongo')

 function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser =  async (email, password, done) => {   
        const query = mongo.User.findOne({ email: email });
        const user = await query.exec();
        if(user == null){
            return done(null, false, {message: 'No user with that email'})
        }

        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message: 'Password incorrect'})
            }
        }catch (e) {
            return done(e)

        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email'}, 
    authenticateUser))

    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => { 

        return done(null, async (id)=> {
            const query = mongo.User.findOne({ id: id });
            const user = await query.exec();
            return user
        })
    })
}

module.exports = initialize