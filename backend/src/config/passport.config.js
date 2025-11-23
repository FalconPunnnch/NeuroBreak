const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const AuthService = require('../core/application/services/AuthService');
const EmailService = require('../core/application/services/EmailService');
const authService = new AuthService();
const emailService = new EmailService();
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await authService.findUserByEmail(email);
          if (user) {
            console.log(`✅ Usuario existente login con Google: ${email}`);
            return done(null, user);
          }
          user = await authService.createUser({
            firstName: profile.name.givenName || profile.displayName.split(' ')[0],
            lastName: profile.name.familyName || profile.displayName.split(' ')[1] || '',
            email: email,
            password: null, // No tiene contraseña (OAuth)
            role: 'student',
            profilePicture: profile.photos[0]?.value || null
          });
          console.log(`✅ Nuevo usuario creado con Google: ${email}`);
          try {
            await emailService.sendWelcomeEmail(
              user.email,
              user.firstName || user.first_name
            );
            console.log(`✅ Email de bienvenida enviado a: ${user.email}`);
          } catch (emailError) {
            console.error('❌ Error al enviar email de bienvenida:', emailError);
          }
          return done(null, user);
        } catch (error) {
          console.error('Error en Google OAuth:', error);
          return done(error, null);
        }
      }
    )
  );
}
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: '/api/auth/microsoft/callback',
        scope: ['user.read']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await authService.findUserByEmail(email);
          if (user) {
            console.log(`✅ Usuario existente login con Microsoft: ${email}`);
            return done(null, user);
          }
          user = await authService.createUser({
            firstName: profile.name.givenName || profile.displayName.split(' ')[0],
            lastName: profile.name.familyName || profile.displayName.split(' ')[1] || '',
            email: email,
            password: null, // No tiene contraseña (OAuth)
            role: 'student',
            profilePicture: null
          });
          console.log(`✅ Nuevo usuario creado con Microsoft: ${email}`);
          try {
            await emailService.sendWelcomeEmail(
              user.email,
              user.firstName || user.first_name
            );
            console.log(`✅ Email de bienvenida enviado a: ${user.email}`);
          } catch (emailError) {
            console.error('❌ Error al enviar email de bienvenida:', emailError);
          }
          return done(null, user);
        } catch (error) {
          console.error('Error en Microsoft OAuth:', error);
          return done(error, null);
        }
      }
    )
  );
}
module.exports = passport;
