import axios from "axios"
import store from "@/store";
export default class CampaignService {

    getBaseUrl() {
        return store.getters.getBaseUrl;
    }
    getAuthenticationToken() {
        return `Bearer ${JSON.parse(localStorage.getItem('user')).token}`;
    }
    retrieveCampaigns() {
        return axios
            .get(`${this.getBaseUrl()}campaign/all`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthenticationToken()
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
                    'Authorization': this.getAuthenticationToken()
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
                    'Authorization': this.getAuthenticationToken()
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
                    'Authorization': this.getAuthenticationToken()
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
                    'Authorization': this.getAuthenticationToken()
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