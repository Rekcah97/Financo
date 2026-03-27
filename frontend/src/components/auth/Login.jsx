import React, { useState } from "react";

function Login() {
  const [credential, setCredential] = useState({ email: "", password: "" });
  const onChange = (e) => {
    setCredential({ ...credential, [e.target.name]: [e.target.value] });
  };
  return (
    <>
      <form>
        <div className="flex flex-col items-center justify-center w-screen h-full  bg-[linear-gradient(135deg,_#11182e_0%,_#060e20_20%,_#060e20_80%,_#13162f_100%)] gap-8">
          <div className="flex flex-col text-center gap-1">
            <h2 className="font-[Manrope] font-bold text-white text-4xl">
              Secure Access
            </h2>
            <p className="text-[var(--text-secondary)]">Login to proceed</p>
          </div>
          <div className="flex flex-col bg-[var(--box-bg)] min-w-4/5 p-8 gap-3 rounded-xl shadow-2xl md:min-w-1/5">
            <label htmlFor="email">
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

            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rememberCredential"
                id="rememberCredential"
                className="check-box"
              />{" "}
              <label htmlFor="rememberCredential">
                <p className="text-[var(--text-secondary)]">
                  Remember this Device
                </p>
              </label>
            </div>

            <button
              type="submit"
              className="p-4 rounded-full font-bold text-[var(--box-bg)] bg-[linear-gradient(90deg,_#9b9efd_0%,_#8588f7_50%,_#6265ee_100%)] cursor-pointer hover:opacity-80"
            >
              Secure Sign In
            </button>
            <button className="p-4 rounded-full font-bold text-[var(--primary)] cursor-pointer hover:underline ">
              Forgot Password ?
            </button>
          </div>
          <p className="text-[var(--text-secondary)]">
            By Logging in your account you agree to our Terms & Privacy.{" "}
          </p>
        </div>
      </form>
    </>
  );
}

export default Login;
