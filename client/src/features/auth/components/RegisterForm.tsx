import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "../AuthContext";

function RegisterForm() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
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
            await register({
                name,
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
                    : "Unable to create account";

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
                <Label htmlFor="name">
                    Full name
                </Label>

                <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-email">
                    Email
                </Label>

                <Input
                    id="register-email"
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
                <Label htmlFor="register-password">
                    Password
                </Label>

                <div className="relative">
                    <Input
                        id="register-password"
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        minLength={8}
                        className="pr-10"
                        required
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                (value) => !value
                            )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                        {showPassword ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                </div>

                <p className="text-xs text-zinc-400">
                    Use at least 8 characters.
                </p>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-zinc-950 text-white hover:bg-zinc-800"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    <>
                        Create account
                        <ArrowRight className="size-4" />
                    </>
                )}
            </Button>

            <p className="text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-pink-600 hover:text-pink-700"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}

export default RegisterForm;