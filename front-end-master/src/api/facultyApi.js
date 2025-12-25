import axiosClient from "./axiosClient";

const facultyApi = {
    getAll: (params) => {
        return axiosClient.get("/faculties", { params });
    },
};

export default facultyApi;
