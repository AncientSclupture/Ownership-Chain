import { ActivityLayout } from "../components/layout";
import { useParams } from "react-router-dom";


function Markeatasset() {
  const { id } = useParams();

  return (
    <ActivityLayout isLoadPage={false}>
      <div>
        <h1>Asset Detail</h1>
        <p>ID: {id}</p>
      </div>
    </ActivityLayout>
  );
}
export default Markeatasset;
