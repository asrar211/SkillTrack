import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import { useAuth } from "../AuthContext";

function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await login({
                email,
                password,
            });

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to login";

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">
                    Email
                </Label>

                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    required
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">
                        Password
                    </Label>

                    <button
                        type="button"
                        className="text-xs font-medium text-pink-600 hover:text-pink-700"
                    >
                        Forgot password?
                    </button>
                </div>

                <div className="relative">
                    <Input
                        id="password"
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        className="pr-10"
                        required
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-zinc-950 text-white hover:bg-zinc-800"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    <>
                        Sign in
                        <ArrowRight className="size-4" />
                    </>
                )}
            </Button>

            <p className="text-center text-sm text-zinc-500">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="font-semibold text-pink-600 hover:text-pink-700"
                >
                    Create one
                </Link>
            </p>
        </form>
    );
}

export default LoginForm;