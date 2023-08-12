import axios from "axios"
import store from "@/store";
import getAuthorizationToken from "@/services/auth-header-service"
export default class CampaignService {

    getBaseUrl() {
        return store.getters.getBaseUrl;
    }
    retrieveCampaigns() {
        return axios
            .get(`${this.getBaseUrl()}campaign/all`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthorizationToken()
                }
            })
            .then(response => {
                return Promise.resolve(response);
            })
            .catch(error => {
                throw error;
            });
    }

    createCampaign(paramCampaign) {
        return axios
            .post(`${this.getBaseUrl()}campaign`, paramCampaign, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthorizationToken()
                }
            })
            .then(response => {
                return Promise.resolve(response);
            })
            .catch(error => {
                throw error;
            });
    }

    updateCampaign(paramCampaign) {
        return axios
            .put(`${this.getBaseUrl()}campaign`, paramCampaign, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthorizationToken()
                }
            })
            .then(response =>  {
                return Promise.resolve(response);
            })
            .catch(error => {
                throw error
            });
    }

    deleteCampaign(paramCampaign) {
        return axios
            .delete(`${this.getBaseUrl()}campaign/delete/${paramCampaign.campaignId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthorizationToken()
                }
            })
            .then(response => {
                return Promise.resolve(response);
            })
            .catch(error => {
                throw error;
            });
    }
    deleteSelectedCampaigns(paramSelectedCampaigns) {
        return axios
            .delete(`${this.getBaseUrl()}campaign/delete/selected-campaigns`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthorizationToken()
                },
                data: paramSelectedCampaigns
            })
            .then(response => {
                return Promise.resolve(response);
            })
            .catch(error => {
                throw error;
            });
    }
}