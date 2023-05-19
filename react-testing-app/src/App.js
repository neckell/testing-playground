import React from "react";
import "./App.css";
import ComponentA from "./Components/ComponentA";
import ComponentCounter from './Components/ComponentCounter'

export const NameContext = React.createContext();
export const ColorContext = React.createContext();

function App() {
	return (
		<div className="App">
			<NameContext.Provider value={"Smith"}>
				<ColorContext.Provider value={"red"}>
					<ComponentA />
				</ColorContext.Provider>
			</NameContext.Provider>
			<hr></hr>
			<ComponentCounter></ComponentCounter>
		</div>
	);
}

export default App;
