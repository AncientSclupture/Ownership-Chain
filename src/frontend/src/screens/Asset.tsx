import { useParams } from "react-router-dom";

function Asset() {
  const { assetid } = useParams<{ assetid: string }>();

  return (
    <div className="px-5 pt-15 pb-5 md:px-20 space-y-5 md:space-y-10">
      <div>
        {assetid}
      </div>
    </div>
  );
}

export default Asset;
