"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthPageProps {}

const AuthPage: React.FC<AuthPageProps> = ({}) => {
  const [isSign, setIsSign] = useState<boolean>(true);
  return (
    <>
      {isSign ? (
        <LoginForm setIsSign={setIsSign} />
      ) : (
        <SignupForm setIsSign={setIsSign} />
      )}
    </>
  );
};

export default AuthPage;
