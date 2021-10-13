import MyHomepage from "./MyHomepage";
import { Route, Switch } from "react-router-dom";
import MyLogin from "./MyLogin";

function MyContainer(props) {

    return (
        <>
            <Switch>
                {/* Route to show the homepage */}
                <Route
                    path="/" exact
                    render={() => {
                        return (
                            <>
                                <MyHomepage />
                            </>
                        )
                    }}>
                </Route>
                <Route
                    path="/monitor"
                    render={() => {
                        return (
                            <>
                                
                            </>
                        )
                    }}>
                </Route>
                <Route
                    path="/login"
                    render={() => {
                        return (
                            <>
                                <MyLogin/>
                            </>
                        )
                    }}>
                </Route>
                <Route
                    path="/Counter"
                    render={() => {
                        return (
                            <>
                                
                            </>
                        )
                    }}>
                </Route>
            </Switch>
        </>
    );
}

export default MyContainer;