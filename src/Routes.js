import React from "react";
import { Route, Switch } from "react-router-dom";

import ConfigSample from "./containers/ConfigSample";
import InitialPage from "./containers/components/InitialPage";

const Routes = () => {
  return (
    <div>
        <Switch>
          <Route exact path="/" component={ConfigSample} />
          <Route exact path="/main" component={InitialPage} />
        </Switch>
    </div>
  );
};

export default Routes;
