import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import AuthButton from "@/components/auth/AuthButton";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import AuthScreen from "@/components/auth/AuthScreen";
import LogoBrand from "@/components/auth/LogoBrand";

// ─── Validation ──────────────────────────────────────────────────────────────

const validateEmail = (email: string): string | undefined => {
	if (!email.trim()) return "Email is required";
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.trim())) return "Enter a valid email address";
};

const validatePassword = (password: string): string | undefined => {
	if (!password) return "Password is required";
	if (password.length < 8) return "Password must be at least 8 characters";
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignIn() {
	const { signIn, errors, fetchStatus } = useSignIn();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [fieldErrors, setFieldErrors] = useState<{
		email?: string;
		password?: string;
		code?: string;
	}>({});

	const isLoading = fetchStatus === "fetching";

	// ── Sign-in submit ────────────────────────────────────────────────────────

	const handleSubmit = async () => {
		// Client-side validation
		const emailErr = validateEmail(email);
		const passwordErr = validatePassword(password);

		if (emailErr || passwordErr) {
			setFieldErrors({ email: emailErr, password: passwordErr });
			return;
		}
		setFieldErrors({});

		const { error } = await signIn.password({
			emailAddress: email.trim(),
			password,
		});

		if (error) {
			console.error("Sign-in error:", JSON.stringify(error, null, 2));
			return;
		}

		if (signIn.status === "complete") {
			await finalizeSignIn();
		} else if (
			signIn.status === "needs_client_trust" ||
			signIn.status === "needs_second_factor"
		) {
			// Try to send email code for MFA
			const emailCodeFactor = signIn.supportedSecondFactors?.find(
				(f) => f.strategy === "email_code",
			);
			if (emailCodeFactor) {
				await signIn.mfa.sendEmailCode();
			}
		}
	};

	// ── MFA verify ───────────────────────────────────────────────────────────

	const handleVerify = async () => {
		if (!code.trim()) {
			setFieldErrors({ code: "Verification code is required" });
			return;
		}
		setFieldErrors({});

		await signIn.mfa.verifyEmailCode({ code });

		if (signIn.status === "complete") {
			await finalizeSignIn();
		}
	};

	// ── Finalize & navigate ───────────────────────────────────────────────────

	const finalizeSignIn = async () => {
		await signIn.finalize({
			navigate: ({ session, decorateUrl }) => {
				if (session?.currentTask) {
					console.log("Session task pending:", session.currentTask);
					return;
				}
				const url = decorateUrl("/");
				if (url.startsWith("http")) {
					// web fallback — not expected in native
					return;
				}
				router.replace(url as Href);
			},
		});
	};

	// ── MFA / Client trust screen ─────────────────────────────────────────────

	if (
		signIn.status === "needs_client_trust" ||
		signIn.status === "needs_second_factor"
	) {
		return (
			<AuthScreen>
				<LogoBrand />

				<View className="mt-6 items-center">
					<Text className="auth-title text-center">Check your email</Text>
					<Text className="auth-subtitle">
						We sent a verification code to{" "}
						<Text className="font-sans-bold text-primary">{email}</Text>
					</Text>
				</View>

				<AuthCard>
					<View className="auth-form">
						<AuthField
							label="Verification code"
							placeholder="Enter 6-digit code"
							value={code}
							onChangeText={setCode}
							keyboardType="number-pad"
							error={
								fieldErrors.code ??
								(errors?.fields?.code
									? String(errors.fields.code.message)
									: undefined)
							}
						/>

						<AuthButton
							label="Verify"
							onPress={handleVerify}
							disabled={isLoading}
							loading={isLoading}
						/>

						<AuthButton
							label="Resend code"
							onPress={() => signIn.mfa.sendEmailCode()}
							variant="secondary"
							disabled={isLoading}
						/>

						<AuthButton
							label="Start over"
							onPress={() => signIn.reset()}
							variant="secondary"
						/>
					</View>
				</AuthCard>
			</AuthScreen>
		);
	}

	// ── Main sign-in screen ───────────────────────────────────────────────────

	return (
		<AuthScreen>
			<LogoBrand />

			<View className="mt-6 items-center">
				<Text className="auth-title text-center">Welcome back</Text>
				<Text className="auth-subtitle">
					Sign in to continue managing your subscriptions
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
							(errors?.fields?.identifier
								? String(errors.fields.identifier.message)
								: undefined)
						}
					/>

					<AuthField
						label="Password"
						placeholder="Enter your password"
						value={password}
						onChangeText={(v) => {
							setPassword(v);
							if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: undefined }));
						}}
						autoComplete="current-password"
						isPassword
						error={
							fieldErrors.password ??
							(errors?.fields?.password
								? String(errors.fields.password.message)
								: undefined)
						}
					/>

					<AuthButton
						label="Sign in"
						onPress={handleSubmit}
						disabled={!email || !password || isLoading}
						loading={isLoading}
					/>
				</View>
			</AuthCard>

			<View className="auth-link-row">
				<Text className="auth-link-copy">New to Recurly?</Text>
				<Link href="/(auth)/sign-up">
					<Text className="auth-link">Create an account</Text>
				</Link>
			</View>
		</AuthScreen>
	);
}
