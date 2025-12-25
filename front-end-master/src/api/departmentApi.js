import axiosClient from "./axiosClient";

const departmentApi = {
    getTree: () => {
        return axiosClient.get("/departments/tree");
    },

    getAll: () => {
        return axiosClient.get("/departments");
    },

    create: (data) => {
        return axiosClient.post("/departments", data);
    },

    update: (id, data) => {
        return axiosClient.put(`/departments/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/departments/${id}`);
    },
};

export default departmentApi;
