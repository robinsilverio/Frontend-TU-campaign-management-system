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
        getCampaignMappings(state) {
            return state.campaignMappings;
        },
        getSelectedCampaign(state) {
            return state.selectedCampaign;
        }
    },
    actions: {
        retrieveCampaigns({commit}) {
            return campaignService.retrieveCampaigns()
                .then(
                    success => {
                        commit('setCampaigns', success.data.campaigns);
                        return Promise.resolve(success);
                    },
                    error => { return Promise.reject(error); }
                );
        },
        createCampaign({commit}, paramCampaign) {
            return campaignService.createCampaign(paramCampaign)
                .then(
                    success => {
                        commit('addCampaign', success.data);
                        return Promise.resolve(success);
                    },
                    error => { return Promise.reject(error); }
                )
        },
        updateCampaign({commit}, paramCampaign) {
            return campaignService.updateCampaign(paramCampaign)
                .then(
                    success => {
                        commit('replaceCampaignAfterUpdate', success.data);
                        return Promise.resolve(success);
                    },
                    error => {
                        return Promise.reject(error);
                    }
                )
        },
        deleteCampaign({commit}, paramCampaign) {
            return campaignService.deleteCampaign(paramCampaign)
                .then(
                    success => {
                        commit('refreshCampaignsAfterDeletion', [paramCampaign]);
                        return Promise.resolve(success);
                    },
                    error => { return Promise.reject(error); }
                );
        },
        deleteSelectedCampaigns({commit}, paramCampaignsRequest) {
            return campaignService.deleteSelectedCampaigns(paramCampaignsRequest)
                .then(
                    success => {
                        commit('refreshCampaignsAfterDeletion', paramCampaignsRequest.selectedCampaigns);
                        return Promise.resolve(success);
                    },
                    error => {
                        return Promise.reject(error);
                    }
                )
        }
    },
    mutations: {
        addCampaign(state, paramCampaign) {
            state.campaignMappings.push(new CampaignMapping(paramCampaign))
        },
        updateSelectedCampaign(state, campaign){
            state.selectedCampaign = campaign;
        },
        refreshCampaignsAfterDeletion(state, paramCampaignsToBeDeleted) {
            for(let campaign of paramCampaignsToBeDeleted) {
                const campaignIndex = state.campaignMappings
                    .findIndex(campaignMapping => campaignMapping.campaign.campaignId === campaign.campaignId);
                state.campaignMappings.splice(campaignIndex, 1);
            }
        },
        replaceCampaignAfterUpdate(state, updatedCampaign) {
            state.campaignMappings.map(
                campaignMapping => campaignMapping.campaign.campaignId === updatedCampaign.campaignId ?
                campaignMapping.campaign = updatedCampaign : campaignMapping.campaign
            );
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