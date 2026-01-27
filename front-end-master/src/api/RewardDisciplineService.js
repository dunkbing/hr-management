import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reward-discipline';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

const getAll = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
};

const getByUser = async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}`, { headers: getAuthHeader() });
    return response.data;
};

const create = async (formData) => {
    const response = await axios.post(API_URL, formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const deleteRecord = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const downloadFile = (fileName) => {
    const token = localStorage.getItem('token');
    // Direct download link with token in query param or handle via blob if auth header needed (usually simpler to just open window if token is cookie or query, but here we might need to fetch blob)
    // Actually, for file download with Bearer token, it's better to use axios to get blob and trigger save

    return axios.get(`${API_URL}/download/${fileName}`, {
        headers: getAuthHeader(),
        responseType: 'blob',
    });
};

export default {
    getAll,
    getByUser,
    create,
    delete: deleteRecord, // alias delete to avoid keyword conflict if destructured
    downloadFile
};
