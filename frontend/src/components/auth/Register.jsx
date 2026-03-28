import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

function Register() {
  const [credential, setCredential] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const onChange = (e) => {
    setCredential({ ...credential, [e.target.name]: [e.target.value] });
  };
  return (
    <form>
      <div className="flex flex-col items-center justify-center w-screen h-full bg-[linear-gradient(135deg,_#11182e_0%,_#060e20_20%,_#060e20_80%,_#13162f_100%)] gap-8">
        <div className="flex flex-col text-center gap-1">
          <h2 className="font-[Manrope] font-bold text-white text-4xl">
            Create your Account
          </h2>
          <p className="text-[var(--text-secondary)]">Signup to Proceed</p>
        </div>
        <div className="flex flex-col bg-[var(--box-bg)] min-w-[90%] gap-5 rounded-xl py-4 px-4 shadow-2xl md:min-w-1/5 md:p-8">
          <div className="flex flex-col gap-3">
            <label htmlFor="username">
              {" "}
              <b className="text-[var(--text-secondary)]">USERNAME</b>
            </label>
            <input
              type="username"
              placeholder="myUsername"
              name="username"
              id="username"
              value={credential.username}
              required
              onChange={onChange}
              className="input-box"
            />
            <label htmlFor="email">
              {" "}
              <b className="text-[var(--text-secondary)]">EMAIL</b>
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              name="email"
              id="email"
              value={credential.email}
              required
              onChange={onChange}
              className="input-box"
            />
            <label htmlFor="password">
              <b className="text-[var(--text-secondary)]">PASSWORD</b>
            </label>
            <input
              type="password"
              placeholder="........"
              name="password"
              id="password"
              value={credential.password}
              onChange={onChange}
              required
              className="input-box"
            />
            <label htmlFor="confirmPassword">
              <b className="text-[var(--text-secondary)]">CONFIRM PASSWORD</b>
            </label>
            <input
              type="password"
              placeholder="........"
              name="confirmPassword"
              id="confirmPassword"
              value={credential.confirmPassword}
              onChange={onChange}
              required
              className="input-box"
            />
          </div>
          <button
            type="submit"
            className="p-4 rounded-full font-bold text-[var(--box-bg)] bg-[linear-gradient(90deg,_#9b9efd_0%,_#8588f7_50%,_#6265ee_100%)] cursor-pointer hover:opacity-80"
          >
            Register Now
          </button>
          <div className="flex items-center gap-4 ">
            <div className="flex-1 h-px bg-[var(--element-bg)]"></div>
            <span className="text-xs font-bold tracking-[0.3em] text-[var(--text-secondary)]">
              QUICK SINGUP
            </span>
            <div className="flex-1 h-px bg-[var(--element-bg)]"></div>
          </div>
          <div className="Auth-2 flex gap-6 items-center justify-center w-full">
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--button)] p-4 cursor-pointer hover:opacity-80">
              <FaGoogle className="text-lg" /> Google
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--button)]  p-4 cursor-pointer hover:opacity-80">
              <FaGithub className="text-2xl" /> Github
            </button>
          </div>
        </div>
        <p className="px-4 text-[var(--text-secondary)] text-center ">
          By Registering in your account you agree to our Terms & Privacy.{" "}
        </p>
      </div>
    </form>
  );
}

export default Register;
