import { MainLayout } from "../../components/main-layout";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
} from "@react-three/drei";
import modelUrl from "../../assets/house.glb";
import propertyIcon from "../../assets/search.png"; // replace with your actual image path
import tokenizationIcon from "../../assets/blockchain.png";
import votingIcon from "../../assets/voting.png"

export function HowItWorks() {
  return (
    <section className="bg-white py-16 px-6 sm:px-10 text-black">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

      <div className="relative max-w-5xl mx-auto">
        {/* Vertical line (centered) */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-black transform -translate-x-1/2 hidden md:block" />

        {/* STEP 1 */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 relative">
          <div className="md:w-5/12 text-center md:text-right mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Property Selection</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Select many properties that yield high potential for profits based on
              market analysis & growth.
            </p>
          </div>

          {/* Dot */}
          <div className="hidden md:flex items-center justify-center w-6 h-6 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2" />

          <div className="md:w-5/12 flex justify-center md:justify-start">
            <img
              src={propertyIcon}
              alt="Property Selection"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 relative">
          <div className="md:w-5/12 flex justify-center md:justify-end order-last md:order-first">
            <img
              src={tokenizationIcon}
              alt="Tokenization"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Dot */}
          <div className="hidden md:flex items-center justify-center w-6 h-6 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2" />

          <div className="md:w-5/12 text-center md:text-left mt-8 md:mt-0">
            <h3 className="text-xl font-semibold mb-2">Tokenization</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Each asset is tokenized into fractional ownership units using blockchain
              technology.
            </p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          <div className="md:w-5/12 text-center md:text-right mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Voting System</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Whenever a tokenized property changes hands, owners participate in a
              voting process to maintain transparency.
            </p>
          </div>

          {/* Dot */}
          <div className="hidden md:flex items-center justify-center w-6 h-6 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2" />

          <div className="md:w-5/12 flex justify-center md:justify-start">
            <img
              src={votingIcon}
              alt="Voting System"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Mobile vertical layout connector line */}
      <div className="absolute left-1/2 top-0 h-full w-[2px] sm:bg-white md:bg-black transform -translate-x-1/2 md:hidden" />
    </section>
  );
}

export function HouseModel() {
  const { scene } = useGLTF(modelUrl);


  return <primitive object={scene} scale={0.8} position={[-10, -19, -50]} />;
}


export function HomeScreen() {
  return (
    <MainLayout needProtection={false}>
      <section className="flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-16 py-12 md:py-20 bg-white text-black gap-10 md:gap-0">
        {/* Left Section */}
        <div className="md:w-1/2 mx-4 sm:mx-10 md:mx-24 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold mb-2">Discover Digital Assets</h2>
            <p className="text-gray-600 text-sm max-w-md mx-auto md:mx-0">
              Invest in fractional ownership of prime real estate properties with
              blockchain technology. Democratizing high-yield investments.
            </p>
          </div>
          <button className="bg-[#102656] hover:cursor-pointer text-white px-6 py-2 rounded-md hover:bg-[#08132C] transition">
            Explore Properties
          </button>
        </div>

        <div className="w-full md:w-1/2 aspect-[4/3] sm:aspect-[16/9] overflow-hidden justify-center items-center hidden md:flex">
          <Canvas camera={{ position: [4, 2, 4], fov: 45 }}>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 3]} intensity={1.3} castShadow />

            {/* Model */}
            <HouseModel />

            {/* Environment */}
            <Environment preset="city" />

            {/* Controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 3}   // 60°
              maxPolarAngle={Math.PI / 2.2} // 82°
              minAzimuthAngle={-Math.PI / 2} // -90°
              maxAzimuthAngle={Math.PI / 2}  // +90°
            />
          </Canvas>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-[#00081A] text-white text-center px-6 sm:px-10 py-16">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Ownership Chain leverages blockchain technology to tokenize real assets,
          allowing investors to purchase fractions of properties. This approach
          lowers barriers to entry, enabling broader participation in the real
          estate market and providing liquidity to traditionally illiquid assets.
        </p>
      </section>
      {/* How It Work Section*/}
      <section className="text-center px-6 sm:px-10 py-16">
        <HowItWorks />
      </section>

      <section className="bg-[#00081A] text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Ownership Chainer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold mb-3">Blockchain Security</h3>
            <p className="text-gray-400 text-sm">
              Immutable smart contracts ensure transparent and tamper-proof transactions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Fractional Investment</h3>
            <p className="text-gray-400 text-sm">
              Buy a fraction of premium properties and diversify your portfolio with ease.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Instant Liquidity</h3>
            <p className="text-gray-400 text-sm">
              Trade your property tokens anytime on our secure marketplace.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-center text-black py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Own a Piece of Real Estate Digitally
        </h2>
        <p className="text-black text-sm max-w-xl mx-auto mb-8 leading-relaxed">
          Secure and transparent property ownership through tokenization.
          Your gateway to smart investing.
        </p>
        <button className="bg-[#102656] hover:cursor-pointer text-white px-6 py-2 rounded-md hover:bg-[#08132C] transition">
          Explore Assets
        </button>
      </section>

    </MainLayout>
  );
}


