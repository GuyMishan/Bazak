import axios from 'axios';
import history from '../history';

export const signup = (user) => {
    return fetch(`http://localhost:8000/api/signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}
export const signin = (user) => {
    return fetch(`http://localhost:8000/api/signin`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}
export const signout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt')
        return fetch(`/api/signout`, {
            method: "GET",
        })
            .then(response => {
                console.log('signout', response)
            })
            .catch(err => console.log(err));
    }
}

export const authenticate = (data) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data))
    }
}
export const isAuthenticated = () => {
    if (typeof window == 'undefined') {
        return false;
    }
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
}

export async function HierarchyCheck(targetUnitId, targetUnitType) {
    hierarchyCheck(targetUnitId, targetUnitType);

    function unitIdByUserRole() {
        if (isAuthenticated().user.role === "1") {
            return isAuthenticated().user.gdodid;
        }
        if (isAuthenticated().user.role === "2") {
            return isAuthenticated().user.hativaid;
        }
        if (isAuthenticated().user.role === "3") {
            return isAuthenticated().user.ogdaid;
        }
        if (isAuthenticated().user.role === "4") {
            return isAuthenticated().user.pikodid;
        }
    }
    function unitTypeByUserRole() {
        if (isAuthenticated().user.role === "1") {
            return "gdod";
        }
        if (isAuthenticated().user.role === "2") {
            return "hativa";
        }
        if (isAuthenticated().user.role === "3") {
            return "ogda";
        }
        if (isAuthenticated().user.role === "4") {
            return "pikod";
        }
    }

    async function getTargetParentId(targetUnitId, targetUnitType) {
        try {
            let response = await axios.get(`http://localhost:8000/api/${targetUnitType}/${targetUnitId}`)
            if (targetUnitType == 'gdod') {
                return response.data.hativa;
            }
            if (targetUnitType == 'hativa') {
                return response.data.ogda;
            }
            if (targetUnitType == 'ogda') {
                return response.data.pikod;
            }
        } catch {
            history.push(`/signin`);
            return true;
        }
    }

    async function hierarchyCheck(targetUnitId, targetUnitType) {
        if (targetUnitType == 'notype' || isAuthenticated().user.role == '0' || isAuthenticated().user.role == '5') {
            return true;
        }
        if (targetUnitType == 'admin' && isAuthenticated().user.role != '0') {
            history.push(`/signin`);
            return true;
        }
        if (targetUnitId == unitIdByUserRole() && targetUnitType == unitTypeByUserRole()) {
            return true;
        } else {
            if (targetUnitType != 'pikod') {
                targetUnitId = await getTargetParentId(targetUnitId, targetUnitType);
                if (targetUnitType == 'gdod') {
                    targetUnitType = 'hativa';
                }
                else {
                    if (targetUnitType == 'hativa') {
                        targetUnitType = 'ogda';
                    }
                    else {
                        if (targetUnitType == 'ogda') {
                            targetUnitType = 'pikod';
                        }
                    }
                }
                return hierarchyCheck(targetUnitId, targetUnitType);
            } else {
                history.push(`/signin`);
            }
        }
    }
}