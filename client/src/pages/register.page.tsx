import Layout from "@/components/domain/layout";
import RegisterForm from "@/components/domain/register-form";
import type { FC } from "react";

const RegisterPage: FC = () => {
  return (
    <Layout>
      <div className="py-20">
        <div className="mx-auto w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
