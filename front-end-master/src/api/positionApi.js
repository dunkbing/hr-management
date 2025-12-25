import axiosClient from "./axiosClient";

const positionApi = {
    getAll: () => {
        return axiosClient.get("/positions");
    },

    create: (data) => {
        return axiosClient.post("/positions", data);
    },

    update: (id, data) => {
        return axiosClient.put(`/positions/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/positions/${id}`);
    },
};

export default positionApi;
