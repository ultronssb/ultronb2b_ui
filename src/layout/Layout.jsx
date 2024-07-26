import React from "react";
import B2BTabs from "../common/B2BTabs";
import { ModuleJson } from "../ModuleData/ModuleJson";

const Layout = () => {

    const Module = ModuleJson();

    return (
        <div>
            <B2BTabs />
        </div>
    )
}

export default Layout;