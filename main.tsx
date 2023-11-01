import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store';
import Landing from './src/pages/Landing/Landing';
import Login from './src/pages/Auth/Login/Login';
import Register from './src/pages/Auth/Register/Register';
import Stages from './src/pages/Stages';
import ErrorPage from './src/components/ErrorPage';
import { AuthContextProvider } from './src/store/auth-context';
const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Landing />
			},
			{
				path: 'login',
				element: <Login />
			},
			{
				path: 'register',
				element: <Register />
			},
			{
				path: 'stages/:stageSlug/:subStageSlug',
				element: <Stages />
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	</Provider>
);
