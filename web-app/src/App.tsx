import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { Routing } from "./routes";
import { store } from "./redux";

import "./i18n";
import { createTheme } from "./theme";

import "./index.css";
import "react-datasheet-grid/dist/style.css";

function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={createTheme({ colorPreset: "browserbite" })}>
				<CssBaseline />

				<BrowserRouter>
					<Routing />
				</BrowserRouter>
			</ThemeProvider>
		</Provider>
	);
}

export default App;
