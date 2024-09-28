import Layout from "@/components/domain/layout";
import type { FC } from "react";

const TodosPage: FC = () => {
  return (
    <Layout protectedPage>
      <section className="flex flex-col justify-center space-y-16 py-20">
        <h1>Todos Page</h1>
      </section>
    </Layout>
  );
};

export default TodosPage;
