import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './state/store';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Stages from './pages/Stages';
import ErrorPage from './src/components/ErrorPage';
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
		<RouterProvider router={router} />
	</Provider>
);
