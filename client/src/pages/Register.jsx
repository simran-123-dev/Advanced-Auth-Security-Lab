import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Chrome,
  Github,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/AnimatedBackground";
import GlassCard from "../components/GlassCard";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import PasswordStrength from "../components/PasswordStrength";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the Terms of Service" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
  });

  const watchPassword = watch("password", "");
  const passwordField = register("password");

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    setLoading(false);
    if (result.success) {
      setRegistrationResult(result.data);
    }
  };

  // Handle Google OAuth - Direct redirect
  const handleGoogleLogin = () => {
    console.log("Google button clicked");
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  // Handle GitHub OAuth - Direct redirect
  const handleGithubLogin = () => {
    console.log("GitHub button clicked");
    window.location.href = "http://localhost:5000/api/v1/auth/github";
  };

  return (
    <div className="auth-container">
      <AnimatedBackground />

      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl items-center">
        {/* Left Side */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center p-8 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative w-64 h-64"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute inset-0 w-32 h-32 rounded-full border-2 border-white/10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white/40" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h2
            className="text-4xl font-bold gradient-text text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create Account
          </motion.h2>
          <motion.p
            className="text-white/60 text-center text-lg max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join Advanced Auth & Security Lab and experience enterprise-grade
            authentication
          </motion.p>

          <motion.div
            className="flex gap-4 text-white/40 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Secure
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary-500" />
              Encrypted
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent-500" />
              Verified
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side - Register Form */}
        <GlassCard glow className="w-full max-w-md mx-auto lg:mx-0">
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Create Account
              </motion.h1>
              <motion.p
                className="text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Start your journey with us today
              </motion.p>
            </div>

            {/* Social Login */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 cursor-pointer"
              >
                <Chrome size={18} className="text-white/60" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                onClick={handleGithubLogin}
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 cursor-pointer"
              >
                <Github size={18} className="text-white/60" />
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0a0a0f] text-white/30">
                  or sign up with
                </span>
              </div>
            </div>

            {/* Form */}
            {registrationResult ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-primary-500/20 bg-primary-500/10 p-4">
                  <h2 className="font-semibold text-primary-300">Account created</h2>
                  <p className="mt-1 text-sm text-white/50">
                    {registrationResult.emailSent === false
                      ? 'Email delivery is unavailable right now. Use the demo verification link below.'
                      : 'Verification email was requested. If it does not arrive, use the demo verification link below.'}
                  </p>
                </div>

                {registrationResult.verificationLink && (
                  <a
                    href={registrationResult.verificationLink}
                    className="block rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 text-sm text-primary-300 transition-colors break-all"
                  >
                    Verify account now
                  </a>
                )}

                <AuthButton type="button" onClick={() => navigate('/login')}>
                  Go to Login
                  <ArrowRight size={18} className="ml-2 inline" />
                </AuthButton>
              </div>
            ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <AuthInput
                label="Full Name"
                placeholder="John Doe"
                icon={User}
                error={errors.name?.message}
                {...register("name")}
              />

              <AuthInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="space-y-1.5">
                <AuthInput
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  icon={Lock}
                  error={errors.password?.message}
                  {...passwordField}
                />
                <PasswordStrength password={watchPassword || ""} />
              </div>

              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={Lock}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <div className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="mt-1 h-4 w-4 cursor-pointer rounded border-white/20"
                />
                <label className="cursor-pointer text-white/40">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-400 text-sm">{errors.terms.message}</p>
              )}

              <AuthButton type="submit" loading={loading}>
                Create Account
                <ArrowRight size={18} className="ml-2 inline" />
              </AuthButton>
            </form>
            )}

            {/* Footer */}
            <motion.p
              className="text-center text-white/40 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
