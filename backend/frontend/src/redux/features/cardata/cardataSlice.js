import { createSlice } from '@reduxjs/toolkit'
const axios = require("axios");

export const cardataSlice = createSlice({
  name: 'cardata',
  initialState: {
    value: [],
  },
  reducers: {
    getCarData: (state, action) => {
      state.value = action.payload;
    },
    clearCarData: (state) => {
      state.value = [];
    },
    findcardatabyidandupdate: (state, action) => {
      for (let i = 0; i < state.value.length; i++) {
        if (action.payload._id == state.value[i]._id) {
          state.value[i] = { ...action.payload };
        }
      }
    },
    findcardatabyidanddelete: (state, action) => {
      for (let i = 0; i < state.value.length; i++) {
        if (action.payload == state.value[i]._id) {
          state.value.splice(i, 1);
        }
      }
    },
  },
})

export const getCarDataFunc = (data) => async (dispatch) => {// gets user
  let unittype;
  let unitid;
  switch (data.role) {
    case '0':
      unittype = 'admin';
      unitid = '0';
      break;
    case '1':
      unittype = 'gdod';
      unitid = data.gdodid;
      break;
    case '2':
      unittype = 'hativa';
      unitid = data.hativaid;
      break;
    case '3':
      unittype = 'ogda';
      unitid = data.ogdaid;
      break;
    case '4':
      unittype = 'pikod';
      unitid = data.pikodid;
      break;
    case '5':
      unittype = 'general';
      unitid = '5';
      break;
  }

  await axios.get(`http://localhost:8000/api/cardata/cardatabyunittypeandunitid/${unittype}/${unitid}`)
    .then(response => {
      dispatch(getCarData(response.data));
    })
    .catch((error) => {
      console.log(error);
    })
};

export const findcardatabyidandupdateFunc = (data) => async (dispatch) => {
  dispatch(findcardatabyidandupdate(data));
};

export const findcardatabyidanddeleteFunc = (data) => async (dispatch) => {
  dispatch(findcardatabyidanddelete(data));
};

export const { getCarData, clearCarData, findcardatabyidandupdate,findcardatabyidanddelete } = cardataSlice.actions

export default cardataSlice.reducer