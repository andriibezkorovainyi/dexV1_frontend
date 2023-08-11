import {createBrowserRouter, createHashRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom";
import {Swap} from "../pages/Swap/Swap";
import {MainLayout} from "../layouts/MainLayout";
import {Liquidity} from "../pages/Liquidity/Liquidity";

export const router = createHashRouter(
    createRoutesFromElements(
        <Route path="" element={<MainLayout />}>
            <Route index element={<Navigate to={'swap'} replace />} />
            <Route path='swap' element={<Swap />} />
            <Route path='liquidity' element={<Liquidity />} />
            <Route path='*' element={<Navigate to={'swap'} replace />} />
        </Route>
    )
);
