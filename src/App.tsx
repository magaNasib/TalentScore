import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Stages from './pages/Stages';
import Landing from './pages/Landing/Landing';
import ReportFront from './assets/report-front.png';
import ReportBack from './assets/report-back.png';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { setShowReport } from './state/report/reportSlice';
import Login from 'pages/Auth/Login/Login';
import Register from 'pages/Auth/Register/Register';
import AuthMiddleware from 'middleware/Auth';
import Profile from 'pages/Auth/Profile/Profile';
import PersistLogin from 'pages/Landing/components/PersistLogin';
import Home from 'pages/Home';
import Report from 'pages/Auth/Profile/Report/Report';
import CV from 'pages/Auth/Profile/cv/pages/Resume/CV';
import Certificate from 'pages/Auth/Profile/Certificate/Certificate';


const App = () => {
	const { showReport } = useAppSelector(state => state.reportState);
	const dispatch = useAppDispatch();


	return (

		<>
			<Routes>


				<Route path='/' element={<PersistLogin />}>
					<Route index element={<Landing />}></Route>

					<Route path='login' element={<Login />}></Route>
					<Route path='register' element={<Register />}></Route>
					<Route path='profile' element={<AuthMiddleware />}>
						<Route index element={<Profile />}></Route>
						<Route path='report' element={<Report />}></Route>
						<Route path='cv' element={<CV />}></Route>
						<Route path='certificate' element={<Certificate />}></Route>
						<Route path='stages/:stageSlug/:subStageSlug' element={<Stages />}></Route>
					</Route>
				</Route>
				<Route path='*' element={<Navigate to='/' />}></Route>

			</Routes>
		</>
	);
};

export default App;
