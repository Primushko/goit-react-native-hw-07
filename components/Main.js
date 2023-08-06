import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { authStateChangedUser } from "../redux/auth/authOperations";
import useRoute from "../router"
import { getUserIsAuth } from "../redux/auth/authSelectors";


const Main = () => {
    const isAuth = useSelector(getUserIsAuth)
    const dispatch = useDispatch()

    const routing = useRoute({ isAuth });

    useEffect(() => {
        dispatch(authStateChangedUser())
    }, [])

    return <NavigationContainer>{routing}</NavigationContainer>
}

export default Main;