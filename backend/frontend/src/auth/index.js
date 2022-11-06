import axios from 'axios';
import React, {useState} from 'react';

export const signup = (user) => {
    return fetch(`http://localhost:8000/api/signup`,{
       method: "POST",
       headers:{
           Accept:'application/json',
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
    return fetch(`http://localhost:8000/api/signin`,{
       method: "POST",
       headers:{
           Accept:'application/json',
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
    if(typeof window !== 'undefined') {
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
    if(typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data))
    }
}

export const isAuthenticated = () => {
    if(typeof window == 'undefined') {
        return false;
    }
    if(localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
}

export async function hierarchyCheck(){
    const unitIdByUserRole = () =>{
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

    const getTargetParentId= (targetUnitId, targetUnitType) => {
         axios.get(`http://localhost:8000/api/${targetUnitType}/${targetUnitId}`)
        .then(response => {
        if (targetUnitType == 'gdod') {
            return response.data.hativa;
        }
        if (targetUnitType == 'hativa') {
            return response.data.ogda;
        }
        if (targetUnitType == 'ogda') {
            return response.data.pikod;
        }
        
        })
        .catch((error) => {
        console.log(error);
        })
    }
    const hierarchyCheck = (targetUnitId, targetUnitType) => {
    if(targetUnitId == unitIdByUserRole()){
        return true;
    }else{
        if (targetUnitType != 'pikod') {
            targetUnitId = getTargetParentId(targetUnitId, targetUnitType);
            if (targetUnitType == 'gdod') {
                targetUnitType = 'hativa';
            }
            if (targetUnitType == 'hativa') {
                targetUnitType = 'ogda';
            }
            if (targetUnitType == 'ogda') {
                targetUnitType = 'pikod';
            }
            if(targetUnitType == 'notype'){
                return true;
            }
            return hierarchyCheck(targetUnitId, targetUnitType);
        }else{
            return false;
        }
    }
    }
}