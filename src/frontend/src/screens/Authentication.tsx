
function Authentication() {
  return (
    <div className="pt-25 px-10">
      <div className="md:flex md:space-x-10">
        <div className="aspect-[4/3] w-[80vw] md:w-[60vw] flex justify-center items-center">
          <img
            src="./src/assets/findwaylogo.png"
            alt="findway-logo"
            className="w-full h-full border border-[rgb(0,8,26)] object-contain rounded-4xl"
          />
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


        </div>
      </div>
    </div>
  );
}

export default Authentication;
