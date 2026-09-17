import { IUser } from "@/api/CurrentUser";
import { IAppConfig } from "@/api/AppConfig";

export type HeaderProps = {
    navbarOpen:boolean;
    setNavbarOpen:any;
    user:IUser|null;
    // Server-fetched app config, threaded down from the root layout (same
    // source the Footer uses). Optional so client consumers can still fall
    // back to the Zustand store / hardcoded constants.
    config?: IAppConfig;
}