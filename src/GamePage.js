import ASCIIFPS from "./components/ASCIIFPS/ASCIIFPS";
import Header from "./components/Header/Header";
import "./GamePage.css";

function GamePage() {
  return (
    <div className="GamePage">
      <Header
        title="ASCII FPS"
        menu={["Author", "Contact", "GitHub", "Portifolio"]}
      />
      <ASCIIFPS />
    </div>
  );
}

export default GamePage;
