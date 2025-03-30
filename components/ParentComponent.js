import Header from "./Header";
import Aside from "./Aside";

function ParentComponent(props) {
  return (
    <div>
      <Header handleAsideOpen={props.appAsideOpen} />
      <Aside asideOpen={props.appOpen} handleAsideOpen={props.appAsideOpen} />
    </div>
  );
}

export default ParentComponent;
