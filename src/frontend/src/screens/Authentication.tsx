import { useAuth } from "../context/AuthContext";
import { MainLayout } from "../layout/main-layout";

function Authentication() {
  const { login, isAuthenticated, logout } = useAuth();

  return (
    <MainLayout>
      <div className="pt-25 px-10">
        <div className="md:flex md:space-x-10">
          <div className="aspect-[4/3] bg-gray-500 w-[80vw] md:w-[60vw] flex justify-center items-center">
            Findway Logo
          </div>
          <div className="">
            <h1 className="font-semibold text-4xl my-5">Ownership Chaninner</h1>
            <p className="text-sm my-2">
              A Real World Asset Platform that <span className="font-bold font-mono">tokenize </span>
              your assets. You can trade, sell, buy and do another activiies as you in do the real world.
            </p>

            {/* edit here */}
            <code>Hallo world</code>
            {/* edit here */}

            <div className="w-full my-10 text-white">
              <div className="space-y-5">
                {isAuthenticated &&
                  <button
                    onClick={logout}
                    className="px-5 py-3 bg-red-600 rounded-lg font-semibold cursor-pointer"
                  >
                    Loggout
                  </button>
                }
                {!isAuthenticated &&
                  <div className="space-y-5">
                    <p className="capitalize text-start text-sm">Login to access feature and continue</p>
                    <button
                      onClick={login}
                      className="px-5 py-3 bg-pink-600 rounded-lg font-semibold cursor-pointer"
                    >
                      Login Use Definity Account
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Authentication;
