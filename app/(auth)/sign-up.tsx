import { useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import AuthButton from "@/components/auth/AuthButton";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import AuthScreen from "@/components/auth/AuthScreen";
import LogoBrand from "@/components/auth/LogoBrand";

// validation email
const validateEmail = (email: string): string | undefined => {
	if (!email.trim()) return "Email is required";
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.trim())) return "Enter a valid email address";
};

const validatePassword = (password: string): string | undefined => {
	if (!password) return "Password is required";
	if (password.length < 8) return "Password must be at least 8 characters";
};

const validateConfirmPassword = (
	password: string,
	confirm: string,
): string | undefined => {
	if (!confirm) return "Please confirm your password";
	if (password !== confirm) return "Passwords don't match";
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignUp() {
	const { signUp, errors, fetchStatus } = useSignUp();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [code, setCode] = useState("");
	const [fieldErrors, setFieldErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
		code?: string;
	}>({});

	const isLoading = fetchStatus === "fetching";

	// ── Sign-up submit ────────────────────────────────────────────────────────

	const handleSubmit = async () => {
		// Client-side validation
		const emailErr = validateEmail(email);
		const passwordErr = validatePassword(password);
		const confirmErr = validateConfirmPassword(password, confirmPassword);

		if (emailErr || passwordErr || confirmErr) {
			setFieldErrors({
				email: emailErr,
				password: passwordErr,
				confirmPassword: confirmErr,
			});
			return;
		}
		setFieldErrors({});

		const { error } = await signUp.password({
			emailAddress: email.trim(),
			password,
		});

		if (error) {
			console.error("Sign-up error:", JSON.stringify(error, null, 2));
			return;
		}

		// Trigger email verification
		if (!error) {
			const { error: verifyError } = await signUp.verifications.sendEmailCode();
			if (verifyError) {
				console.error("Email verification send error:", JSON.stringify(verifyError, null, 2));
			}
		}
	};

	// ── Email verification ────────────────────────────────────────────────────

	const handleVerify = async () => {
		if (!code.trim()) {
			setFieldErrors({ code: "Verification code is required" });
			return;
		}
		setFieldErrors({});

		const { error } = await signUp.verifications.verifyEmailCode({ code });
		if (error) {
			console.error("Email verify error:", JSON.stringify(error, null, 2));
			return;
		}

		if (signUp.status === "complete") {
			await signUp.finalize({
				navigate: ({ session }) => {
					if (session?.currentTask) {
						console.log("Session task pending:", session.currentTask);
						return;
					}
				},
			});
		} else {
			console.error("Sign-up not complete after verify:", signUp.status);
		}
	};

	// ── Email verification screen ────

	if (
		signUp.status === "missing_requirements" &&
		signUp.unverifiedFields?.includes("email_address") &&
		signUp.missingFields?.length === 0
	) {
		return (
			<AuthScreen>
				<LogoBrand />

				<View className="mt-6 items-center">
					<Text className="auth-title text-center">Verify your email</Text>
					<Text className="auth-subtitle">
						We sent a code to{" "}
						<Text className="font-sans-bold text-primary">{email}</Text>. Enter
						it below to activate your account.
					</Text>
				</View>

				<AuthCard>
					<View className="auth-form">
						<AuthField
							label="Verification code"
							placeholder="Enter 6-digit code"
							value={code}
							onChangeText={(v) => {
								setCode(v);
								if (fieldErrors.code) setFieldErrors((e) => ({ ...e, code: undefined }));
							}}
							keyboardType="number-pad"
							error={
								fieldErrors.code ??
								(errors?.fields?.code
									? String(errors.fields.code.message)
									: undefined)
							}
						/>

						<AuthButton
							label="Verify email"
							onPress={handleVerify}
							disabled={isLoading}
							loading={isLoading}
						/>

						<AuthButton
							label="Resend code"
							onPress={async () => {
								const { error } = await signUp.verifications.sendEmailCode();
								if (error) {
									console.error("Resend error:", JSON.stringify(error, null, 2));
								}
							}}
							variant="secondary"
							disabled={isLoading}
						/>
					</View>
				</AuthCard>
			</AuthScreen>
		);
	}

	// ── Main sign-up screen ───────────────────────────────────────────────────

	return (
		<AuthScreen>
			<LogoBrand />

			<View className="mt-6 items-center">
				<Text className="auth-title text-center">Create your account</Text>
				<Text className="auth-subtitle">
					Start tracking your subscriptions in minutes
				</Text>
			</View>

			<AuthCard>
				<View className="auth-form">
					<AuthField
						label="Email"
						placeholder="Enter your email"
						value={email}
						onChangeText={(v) => {
							setEmail(v);
							if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: undefined }));
						}}
						keyboardType="email-address"
						autoComplete="email"
						error={
							fieldErrors.email ??
							(errors?.fields?.emailAddress
								? String(errors.fields.emailAddress.message)
								: undefined)
						}
					/>

					<AuthField
						label="Password"
						placeholder="Create a password"
						value={password}
						onChangeText={(v) => {
							setPassword(v);
							if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: undefined }));
						}}
						autoComplete="new-password"
						isPassword
						error={
							fieldErrors.password ??
							(errors?.fields?.password
								? String(errors.fields.password.message)
								: undefined)
						}
					/>

					<AuthField
						label="Confirm password"
						placeholder="Re-enter your password"
						value={confirmPassword}
						onChangeText={(v) => {
							setConfirmPassword(v);
							if (fieldErrors.confirmPassword)
								setFieldErrors((e) => ({ ...e, confirmPassword: undefined }));
						}}
						autoComplete="new-password"
						isPassword
						error={fieldErrors.confirmPassword}
					/>

					<AuthButton
						label="Create account"
						onPress={handleSubmit}
						disabled={!email || !password || !confirmPassword || isLoading}
						loading={isLoading}
					/>
				</View>
			</AuthCard>

			<View className="auth-link-row">
				<Text className="auth-link-copy">Already have an account?</Text>
				<Link href="/(auth)/sign-in">
					<Text className="auth-link">Sign in</Text>
				</Link>
			</View>

			{/* Required by Clerk for bot sign-up protection */}
			<View nativeID="clerk-captcha" />
		</AuthScreen>
	);
}
