import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store';
import Landing from 'pages/Landing/Landing';
import Login from 'pages/Auth/Login/Login';
import Register from 'pages/Auth/Register/Register';
import Stages from 'pages/Stages';
import ErrorPage from 'components/ErrorPage';

import Report from 'pages/Auth/Profile/Report/Report'
import AuthMiddleware from 'middleware/Auth';
import Profile from 'pages/Auth/Profile/Profile';
import { AuthContextProvider } from 'store/auth-context';
// const router = createBrowserRouter([
// 	{
// 		path: '/',
// 		element: <App />,
// 		errorElement: <ErrorPage />,
// 		children: [
// 			{
// 				path: '/',
// 				element: <Landing />
// 			},
// 			{
// 				path: 'login',
// 				element: <Login />
// 			},
// 			{
// 				path: 'register',
// 				element: <Register />
// 			}, {
// 				path: 'profile',
// 				element: <Profile />
// 			},
// 			{
// 				path: 'report',
// 				element: <Report />

// 			},
// 			{
// 				path: 'stages/:stageSlug/:subStageSlug',
// 				element: <Stages />
// 			}
// 		]
// 	}
// ]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<BrowserRouter>
			<AuthContextProvider>
				{/* <RouterProvider router={router} /> */}
				<App/>
			</AuthContextProvider>
		</BrowserRouter>
	</Provider>
);
