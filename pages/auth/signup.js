import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/auth/signin");
    } else {
      setError(data.message || "Error occurred");
    }
  };

  return (
    <div className="flex flex-center full-h">
      <div className="loginform">
        <div className="heading">Sign Up Create Admin</div>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="input"
            required
          />
          <button className="login-button" type="submit">
            Sign Up
          </button>
          {error && <p>{error}</p>}
          <Link
            style={{ color: "blue", textDecoration: "underline" }}
            className="agreement"
            href="/auth/signin"
          >
            Sign In{" "}
          </Link>
        </form>
      </div>
    </div>
  );
}
