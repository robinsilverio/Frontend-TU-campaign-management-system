import axios from "axios"
import store from "@/store";
export default class CampaignService {
    retrieveCampaigns() {
        const API_URL = store.getters.getBaseUrl;
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

    deleteCampaign(paramCampaign) {
        const API_URL = store.getters.getBaseUrl;
        const authenticatedUser = JSON.parse(localStorage.getItem('user'));
        const response = axios
            .delete(API_URL + `campaign/delete/${paramCampaign.campaignId}`, {
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
    deleteSelectedCampaigns(paramSelectedCampaigns) {
        const API_URL = store.getters.getBaseUrl;
        const authenticatedUser = JSON.parse(localStorage.getItem('user'));
        const response = axios
            .delete(API_URL + `campaign/delete/all`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authenticatedUser.token}`
                },
                data: paramSelectedCampaigns
            })
            .then(response => {
                return Promise.resolve(response);
            })
            .catch(error => {
                throw error;
            });
        return response;
    }
}