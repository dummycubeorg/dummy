import Layout from "@/components/domain/layout";
import LoginForm from "@/components/domain/login-form";
import type { FC } from "react";

const LoginPage: FC = () => {
  return (
    <Layout>
      <div className="py-20">
        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
