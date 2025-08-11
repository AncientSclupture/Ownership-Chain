import { LoginField, WelcomeField } from "../components/authentcation-components/authentication";
import { MainLayout } from "../layout/main-layout";

function Authentication() {

  return (
    <MainLayout>
      <div>
        <div>
          <div className="w-full h-screen flex flex-col items-center px-20">
            <WelcomeField />
            <LoginField />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Authentication;
