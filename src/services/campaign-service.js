import axios from "axios"
import store from "@/store";
export default class CampaignService {
    retrieveCampaigns(paramBaseUrl) {
        const API_URL = paramBaseUrl;
        const authenticatedUser = JSON.parse(localStorage.getItem('user'));
        const response = axios
            .get(API_URL + 'campaign/all', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authenticatedUser.token}`
                }
            })
            .then(response => {
                return Promise.resolve(response);
            })
            .catch(error => {
                throw error;
            });
        return response;
    }

    createCampaign(paramCampaign, paramBaseUrl) {

    }

    updateCampaign(paramCampaign, paramBaseUrl) {

    }

    deleteCampaign(paramBaseUrl) {

    }
}