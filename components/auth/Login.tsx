"use client";

export default function Login() {
  return (
    <div className="form-control">
      <label htmlFor="loginEmail" className="label">
        <span className="label-text">Email</span>
      </label>
      <input
        type="email"
        id="loginEmail"
        name="loginEmail"
        placeholder="email"
        className="input input-bordered"
        minLength={2}
        required
      />
      <label htmlFor="loginPassword" className="label">
        <span className="label-text">Password</span>
      </label>
      <input
        type="password"
        id="loginPassword"
        name="loginPassword"
        placeholder="password"
        className="input input-bordered"
        minLength={3}
        required
      />
    </div>
  );
}
