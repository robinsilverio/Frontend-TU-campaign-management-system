import CampaignService from "@/services/campaign-service";
import store from "@/store";
import {CampaignMapping} from "@/models/mapping/CampaignMapping";

const campaignService = new CampaignService();
export const campaigns = {
    state: {
        campaignMappings: [],
        selectedCampaign: null
    },
    getters: {
        getCampaigns(state) {
            return state.campaignMappings;
        },
        getSelectedCampaign(state) {
            return state.selectedCampaign;
        }
    },
    actions: {
        retrieveCampaigns({commit}) {
            const BASE_URL = store.getters.getBaseUrl;
            return campaignService.retrieveCampaigns(BASE_URL)
                .then(
                    success => {
                        commit('setCampaigns', success.data.campaigns);
                        return Promise.resolve(success);
                    },
                    error => { return Promise.reject(error); }
                );
        },
        createCampaign({commit}) {

        },
        updateCampaign({commit}, paramCampaign) {

        },
        deleteCampaign({commit}, paramCampaign) {
            const BASE_URL = store.getters.getBaseUrl;
            return campaignService.deleteCampaign(BASE_URL, paramCampaign)
                .then(
                    success => {
                        commit('refreshCampaignsAfterDeletion', paramCampaign);
                        return Promise.resolve(success);
                    },
                    error => { return Promise.reject(error); }
                );
        }
    },
    mutations: {
        updateSelectedCampaign(state, campaign){
            state.selectedCampaign = campaign;
        },
        refreshCampaignsAfterDeletion(state, paramCampaign) {
            const campaignIndex = state.campaignMappings
                .findIndex(campaignMapping => campaignMapping.campaign.campaignId === paramCampaign.campaignId);
            state.campaignMappings.splice(campaignIndex, 1);
        },
        setCampaigns(state, paramCampaigns) {

            let campaignMappings = [];

            for (let campaign of paramCampaigns) {
                campaignMappings.push(new CampaignMapping(campaign));
            }

            state.campaignMappings = campaignMappings;
        }
    }
}