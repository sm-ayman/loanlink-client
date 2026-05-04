
import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://loanlink-server-six.vercel.app/api'
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
