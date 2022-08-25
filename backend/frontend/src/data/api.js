import axios from 'axios';

const apiURL = 'http://localhost:8000/api/';

export const singleFileUpload = async (data, collec, id) => {
    try {
        data.append('collection', collec);
        data.append('id', id);
        await axios.post(apiURL + 'singleFile', data);
    } catch (error) {
        throw error
        
    }
}