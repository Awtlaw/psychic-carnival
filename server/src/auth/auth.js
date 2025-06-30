import { admins, patients, doctors } from '../database/queries.js';
import passport from 'passport';
import { HashFactory } from '../utils/crypto.js';
import {
  ExtractJwt as ExtractJWT,
  Strategy as JWTStrategy,
} from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

async function localVerifyCb(username, password, done) {
  try {
    // Admins
    let user = await admins.getAdminByEmail(username);
    if (user && (await HashFactory.verifyPassword(password, user.pwd))) {
      return done(null, user, { message: 'Login successful' });
    }

    // Patients
    user = await patients.getPatientByEmail(username);
    if (user && (await HashFactory.verifyPassword(password, user.pwd))) {
      return done(null, user, { message: 'Login successful' });
    }

    // Doctors
    user = await doctors.getDoctorByEmail(username);
    if (user && (await HashFactory.verifyPassword(password, user.pwd))) {
      return done(null, user, { message: 'Login successful' });
    }

    return done(null, false, { message: 'Invalid Credentials' });
  } catch (e) {
    return done(e);
  }
}

async function jwtVerifyCb(payload, done) {
  const user =
    (await admins.getAdminById(payload.sub)) ||
    (await patients.getPatientById(payload.sub)) ||
    (await doctors.getDoctorById(payload.sub));
  if (!user) return done(null, false);
  return done(null, user);
}

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const localStrategy = new LocalStrategy(localVerifyCb);
const jwtStrategy = new JWTStrategy(jwtOptions, jwtVerifyCb);

passport.use('login', localStrategy);
passport.use(jwtStrategy);
