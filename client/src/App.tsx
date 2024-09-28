import { Route, Switch } from "wouter";
import HomePage from "./pages/home.page";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import TodosPage from "./pages/todos.page";

function App() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      {/* Protected */}
      <Route path="/todos" component={TodosPage} />
    </Switch>
  );
}

export default App;
