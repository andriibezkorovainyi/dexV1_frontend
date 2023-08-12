import {Header} from "../components/header/Header";
import {Outlet} from "react-router-dom";
import {Footer} from "../components/footer/Footer";
import EasterEggContainer from "../components/easterEgg/EasterEgg";
import './MainLayout.css'

export const MainLayout = () => {
    setTimeout(() => {
        const mainLayout = document.getElementsByClassName('fade-in')[0];
        mainLayout.classList.add('fade-out');
    }, 3000);

    return (
        <>
            <div className="fade-in">
                <Header/>

                <Outlet/>

                <Footer/>
            </div>

            <EasterEggContainer />
        </>
    );
}
