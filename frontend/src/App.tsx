import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Main from "./components/Layout/Main";
import { publicRoutes, privateRoutes } from "./routes/routes";
import PrivateRoute from "./routes/PrivateRoute";
import OrdersNotification from "./components/Notification";

const App: React.FC = () => {
    const renderPublicRoutes = () =>
        publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
        ));

    const renderPrivateRoutes = () =>
        privateRoutes.map(({ path, element }) => (
            <Route
                key={path}
                path={path}
                element={<PrivateRoute element={element} />}
            />
        ));

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    {renderPublicRoutes()}

                    {/* Routes with Layout */}
                    <Route
                        element={
                            <Layout>
                                <OrdersNotification /> {/* Notification integrated */}
                            </Layout>
                        }
                    >
                        <Route element={<Main />}>{renderPrivateRoutes()}</Route>
                    </Route>

                    {/* Catch-All Route for 404 */}
                    {/* <Route path="*" element={<ErrorPage title="404" subTitle="Page not found" status={404} />} /> */}
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
