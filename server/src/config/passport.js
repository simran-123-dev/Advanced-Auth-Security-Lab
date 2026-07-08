// server/src/config/passport.js

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";
import crypto from "crypto";

/**
 * Passport Configuration for OAuth providers
 * Supports Google and GitHub authentication
 */
class PassportConfig {
  constructor() {
    this.initializeStrategies();
  }

  initializeStrategies() {
    // Google OAuth Strategy
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
            scope: ["profile", "email"],
          },
          this.handleOAuthUser.bind(this)
        )
      );
      console.log("✅ Google OAuth configured");
    } else {
      console.warn("⚠️ Google OAuth not configured - missing credentials");
    }

    // GitHub OAuth Strategy
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      passport.use(
        new GitHubStrategy(
          {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/v1/auth/github/callback`,
            scope: ["user:email"],
          },
          this.handleOAuthUser.bind(this)
        )
      );
      console.log("✅ GitHub OAuth configured");
    } else {
      console.warn("⚠️ GitHub OAuth not configured - missing credentials");
    }
  }

  /**
   * Handle OAuth user creation/retrieval
   */
  async handleOAuthUser(accessToken, refreshToken, profile, done) {
    try {
      const email = profile.emails?.[0]?.value || profile.email;
      const name = profile.displayName || profile.username || "User";
      const provider = profile.provider || "oauth";

      if (!email) {
        return done(new Error("Email not provided by OAuth provider"), null);
      }

      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        // Update OAuth provider info if not already set
        if (!user.oauthProvider) {
          user.oauthProvider = provider;
          user.oauthId = profile.id;
          user.isEmailVerified = true;
          await user.save({ validateBeforeSave: false });
        }
        return done(null, user);
      }

      // Create new user
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user = await User.create({
        name: name,
        email: email,
        password: crypto.randomBytes(32).toString("hex"),
        oauthProvider: provider,
        oauthId: profile.id,
        isEmailVerified: true,
        verificationToken,
        verificationTokenExpiry,
        avatar: profile.photos?.[0]?.value || null,
      });

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }

  /**
   * Serialize user for session
   */
  serializeUser(user, done) {
    done(null, user.id);
  }

  /**
   * Deserialize user from session
   */
  deserializeUser(id, done) {
    User.findById(id)
      .select("-password -refreshToken")
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  }
}

// Initialize passport
const passportConfig = new PassportConfig();
passport.serializeUser(passportConfig.serializeUser.bind(passportConfig));
passport.deserializeUser(passportConfig.deserializeUser.bind(passportConfig));

export default passport;